import { Module } from '@nestjs/common';
import { ConnectionsController } from './connections.controller.js';
import { ConnectionsService } from './connections.service.js';
import { PgClientFactory } from './pg-client.factory.js';

@Module({
  controllers: [ConnectionsController],
  providers: [ConnectionsService, PgClientFactory],
  exports: [ConnectionsService],
})
export class ConnectionsModule {}
