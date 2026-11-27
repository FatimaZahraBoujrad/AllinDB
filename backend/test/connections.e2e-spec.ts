import { ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { App } from 'supertest/types.js';
import request from 'supertest';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { INestApplication } from '@nestjs/common';
import { AppModule } from './../src/app.module.js';
import { PgClientFactory, type PgConnectionClient } from '../src/connections/pg-client.factory.js';

const validConnection = {
  host: '127.0.0.1',
  port: 54329,
  database: 'allindb_demo',
  username: 'allindb_readonly',
  password: 'sample-secret',
  sslMode: 'disable',
};

describe('ConnectionsController (e2e)', () => {
  let app: INestApplication<App>;
  let client: PgConnectionClient;

  beforeEach(async () => {
    client = {
      connect: vi.fn(async () => undefined),
      end: vi.fn(async () => undefined),
      onError: vi.fn(),
    };
    const factory = { create: vi.fn(() => client) };
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(PgClientFactory)
      .useValue(factory)
      .compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
      }),
    );
    await app.init();
  });

  afterEach(async () => {
    await app.close();
  });

  it('tests a valid connection and closes the temporary client', async () => {
    await request(app.getHttpServer())
      .post('/api/connections/test')
      .send(validConnection)
      .expect(200)
      .expect({ status: 'connected' });

    expect(client.connect).toHaveBeenCalledOnce();
    expect(client.end).toHaveBeenCalledOnce();
  });

  it('creates and disconnects an in-memory connection session', async () => {
    const response = await request(app.getHttpServer())
      .post('/api/connections')
      .send(validConnection)
      .expect(201);

    expect(response.body).toEqual({
      status: 'connected',
      connectionId: expect.any(String),
    });
    expect(JSON.stringify(response.body)).not.toContain(
      validConnection.password,
    );

    await request(app.getHttpServer())
      .delete(`/api/connections/${response.body.connectionId}`)
      .expect(200)
      .expect({ status: 'disconnected' });
    expect(client.end).toHaveBeenCalledOnce();
  });

  it('rejects invalid and unexpected request fields before connecting', async () => {
    await request(app.getHttpServer())
      .post('/api/connections/test')
      .send({ ...validConnection, port: 70000, unexpected: 'value' })
      .expect(400);

    expect(client.connect).not.toHaveBeenCalled();
  });

  it('returns a safe error for invalid credentials', async () => {
    client.connect = vi.fn(async () => {
      throw Object.assign(
        new Error(`password=${validConnection.password}`),
        { code: '28P01' },
      );
    });

    const response = await request(app.getHttpServer())
      .post('/api/connections/test')
      .send(validConnection)
      .expect(401);

    expect(response.body.message).toContain('authentication failed');
    expect(JSON.stringify(response.body)).not.toContain(
      validConnection.password,
    );
  });
});
