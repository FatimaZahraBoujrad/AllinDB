import { Injectable } from '@nestjs/common';
import { Client } from 'pg';

export interface PgConnectionClient {
  connect: () => Promise<void>;
  end: () => Promise<void>;
  onError: (listener: (error: Error) => void) => void;
}

export type PgClientOptions = {
  host: string;
  port: number;
  database: string;
  user: string;
  password: string;
  connectionTimeoutMillis: number;
  application_name: string;
  ssl: boolean;
};

@Injectable()
export class PgClientFactory {
  create(options: PgClientOptions): PgConnectionClient {
    const client = new Client(options);
    return {
      connect: async () => {
        await client.connect();
      },
      end: () => client.end(),
      onError: (listener) => {
        client.on('error', listener);
      },
    };
  }
}
