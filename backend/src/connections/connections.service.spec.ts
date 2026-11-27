import {
  BadRequestException,
  ConflictException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { ConnectionDto } from './connection.dto.js';
import { ConnectionsService } from './connections.service.js';
import type {
  PgClientOptions,
  PgConnectionClient,
} from './pg-client.factory.js';

const connection: ConnectionDto = {
  host: '127.0.0.1',
  port: 54329,
  database: 'allindb_demo',
  username: 'allindb_readonly',
  password: 'sample-secret',
  sslMode: 'disable',
};

describe('ConnectionsService', () => {
  let client: PgConnectionClient;
  let createClient: ReturnType<typeof vi.fn>;
  let service: ConnectionsService;

  beforeEach(() => {
    client = {
      connect: vi.fn(async () => undefined),
      end: vi.fn(async () => undefined),
      onError: vi.fn(),
    };
    createClient = vi.fn(
      (_options: PgClientOptions): PgConnectionClient => client,
    );
    service = new ConnectionsService({ create: createClient });
  });

  it('tests a connection and closes the temporary client', async () => {
    await expect(service.testConnection(connection)).resolves.toEqual({
      status: 'connected',
    });

    expect(client.connect).toHaveBeenCalledOnce();
    expect(client.end).toHaveBeenCalledOnce();
    expect(createClient).toHaveBeenCalledWith(
      expect.objectContaining({
        connectionTimeoutMillis: 5000,
        ssl: false,
        password: connection.password,
      }),
    );
  });

  it('requires TLS for non-loopback hosts', async () => {
    await expect(
      service.testConnection({
        host: 'db.example.test',
        port: connection.port,
        database: connection.database,
        username: connection.username,
        password: connection.password,
        sslMode: 'disable',
      }),
    ).rejects.toBeInstanceOf(BadRequestException);
    expect(createClient).not.toHaveBeenCalled();
  });

  it('creates only one active session and explicitly closes it', async () => {
    const session = await service.createSession(connection);

    expect(session.status).toBe('connected');
    expect(session.connectionId).toMatch(
      /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/,
    );
    await expect(service.testConnection(connection)).rejects.toBeInstanceOf(
      ConflictException,
    );
    await expect(service.createSession(connection)).rejects.toBeInstanceOf(
      ConflictException,
    );
    expect(createClient).toHaveBeenCalledOnce();

    await expect(service.disconnect(session.connectionId)).resolves.toEqual({
      status: 'disconnected',
    });
    expect(client.end).toHaveBeenCalledOnce();
  });

  it('does not disclose driver errors when authentication fails', async () => {
    client.connect = vi.fn(async () => {
      throw Object.assign(
        new Error(`password=${connection.password}`),
        { code: '28P01' },
      );
    });

    let caught: unknown;
    await service.testConnection(connection).catch((error: unknown) => {
      caught = error;
    });

    expect(caught).toBeInstanceOf(UnauthorizedException);
    if (caught instanceof UnauthorizedException) {
      expect(JSON.stringify(caught.getResponse())).not.toContain(
        connection.password,
      );
      expect(caught.message).toContain('authentication failed');
    }
    expect(client.end).not.toHaveBeenCalled();
  });

  it('rejects disconnect requests for unknown sessions', async () => {
    await expect(service.disconnect('unknown')).rejects.toBeInstanceOf(
      NotFoundException,
    );
  });

  it('closes the active client when the module shuts down', async () => {
    await service.createSession(connection);
    await service.onModuleDestroy();

    expect(client.end).toHaveBeenCalledOnce();
  });

  it('does not re-end a client that reported an unexpected disconnect', async () => {
    let reportError: ((error: Error) => void) | undefined;
    client.onError = vi.fn((listener) => {
      reportError = listener;
    });
    const session = await service.createSession(connection);

    reportError?.(new Error('connection lost'));
    await expect(service.disconnect(session.connectionId)).resolves.toEqual({
      status: 'disconnected',
    });

    expect(client.end).not.toHaveBeenCalled();
  });

  it('translates unreachable-host and insufficient-permission errors', async () => {
    client.connect = vi.fn(async () => {
      throw Object.assign(new Error('private driver details'), {
        code: 'ETIMEDOUT',
      });
    });
    await expect(service.testConnection(connection)).rejects.toMatchObject({
      status: 503,
      response: {
        message:
          'Could not reach PostgreSQL. Verify the host, port, and server availability.',
      },
    });

    client.connect = vi.fn(async () => {
      throw Object.assign(new Error('private driver details'), {
        code: '42501',
      });
    });
    await expect(service.testConnection(connection)).rejects.toMatchObject({
      status: 403,
      response: {
        message:
          'The PostgreSQL role does not have permission to connect to this database.',
      },
    });
  });
});
