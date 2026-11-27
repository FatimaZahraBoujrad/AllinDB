import {
  ConflictException,
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
  OnModuleDestroy,
  ServiceUnavailableException,
  UnauthorizedException,
} from '@nestjs/common';
import { randomUUID } from 'node:crypto';
import { isIP } from 'node:net';
import { ConnectionDto } from './connection.dto.js';
import {
  PgClientFactory,
  type PgConnectionClient,
} from './pg-client.factory.js';

const CONNECTION_TIMEOUT_MILLISECONDS = 5000;

type ActiveConnection = {
  id: string;
  client: PgConnectionClient;
  lost: boolean;
};

export type ConnectionResult = { status: 'connected' };

export type DisconnectResult = { status: 'disconnected' };

@Injectable()
export class ConnectionsService implements OnModuleDestroy {
  private activeConnection: ActiveConnection | undefined;
  private connectionAttemptInProgress = false;

  constructor(private readonly clientFactory: PgClientFactory) {}

  async testConnection(
    connection: ConnectionDto,
  ): Promise<ConnectionResult> {
    this.beginConnectionAttempt();

    try {
      const client = this.createClient(connection);
      await this.connect(client);
      await this.endClient(client);
      return { status: 'connected' };
    } finally {
      this.connectionAttemptInProgress = false;
    }
  }

  async createSession(
    connection: ConnectionDto,
  ): Promise<ConnectionResult & { connectionId: string }> {
    this.beginConnectionAttempt();

    try {
      const client = this.createClient(connection);
      await this.connect(client);
      const id = randomUUID();
      this.activeConnection = { id, client, lost: false };
      return { status: 'connected', connectionId: id };
    } finally {
      this.connectionAttemptInProgress = false;
    }
  }

  async disconnect(connectionId: string): Promise<DisconnectResult> {
    const activeConnection = this.activeConnection;
    if (!activeConnection || activeConnection.id !== connectionId) {
      throw new NotFoundException('Connection session was not found.');
    }

    this.activeConnection = undefined;
    if (!activeConnection.lost) {
      await this.endClient(activeConnection.client);
    }
    return { status: 'disconnected' };
  }

  async onModuleDestroy(): Promise<void> {
    const activeConnection = this.activeConnection;
    this.activeConnection = undefined;
    if (activeConnection && !activeConnection.lost) {
      await this.endClient(activeConnection.client);
    }
  }

  private beginConnectionAttempt(): void {
    if (this.activeConnection || this.connectionAttemptInProgress) {
      throw new ConflictException(
        'Disconnect the active database session before connecting to another database.',
      );
    }
    this.connectionAttemptInProgress = true;
  }

  private createClient(connection: ConnectionDto): PgConnectionClient {
    if (
      connection.sslMode === 'disable' &&
      !isLoopbackHost(connection.host)
    ) {
      throw new BadRequestException(
        'TLS must be enabled for non-local PostgreSQL hosts.',
      );
    }

    const client = this.clientFactory.create({
      host: connection.host,
      port: connection.port,
      database: connection.database,
      user: connection.username,
      password: connection.password,
      connectionTimeoutMillis: CONNECTION_TIMEOUT_MILLISECONDS,
      application_name: 'AllinDB',
      ssl: connection.sslMode === 'require',
    });
    client.onError(() => {
      if (this.activeConnection?.client === client) {
        this.activeConnection.lost = true;
      }
    });
    return client;
  }

  private async connect(client: PgConnectionClient): Promise<void> {
    try {
      await client.connect();
    } catch (error) {
      throw this.translateConnectionError(error);
    }
  }

  private async endClient(client: PgConnectionClient): Promise<void> {
    try {
      await client.end();
    } catch (error) {
      throw this.translateConnectionError(error);
    }
  }

  private translateConnectionError(error: unknown): Error {
    const code = getErrorCode(error);

    if (code === '28P01' || code === '28000') {
      return new UnauthorizedException(
        'PostgreSQL authentication failed. Check the username and password.',
      );
    }
    if (code === '42501') {
      return new ForbiddenException(
        'The PostgreSQL role does not have permission to connect to this database.',
      );
    }
    if (code === '3D000') {
      return new NotFoundException(
        'The PostgreSQL database was not found. Check the database name.',
      );
    }
    if (
      code === 'ECONNREFUSED' ||
      code === 'ECONNRESET' ||
      code === 'EHOSTUNREACH' ||
      code === 'ENETUNREACH' ||
      code === 'ENOTFOUND' ||
      code === 'EAI_AGAIN' ||
      code === 'ETIMEDOUT'
    ) {
      return new ServiceUnavailableException(
        'Could not reach PostgreSQL. Verify the host, port, and server availability.',
      );
    }

    return new ServiceUnavailableException(
      'Could not establish a PostgreSQL connection. Verify the connection details and database permissions.',
    );
  }
}

function getErrorCode(error: unknown): string | undefined {
  if (
    typeof error === 'object' &&
    error !== null &&
    'code' in error &&
    typeof error.code === 'string'
  ) {
    return error.code;
  }
  return undefined;
}

function isLoopbackHost(host: string): boolean {
  const normalizedHost = host.toLowerCase().replace(/\.$/, '');
  if (
    normalizedHost === 'localhost' ||
    normalizedHost.endsWith('.localhost') ||
    normalizedHost === '::1'
  ) {
    return true;
  }
  return isIP(normalizedHost) === 4 && normalizedHost.startsWith('127.');
}
