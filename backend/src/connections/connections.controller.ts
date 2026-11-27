import {
  Body,
  Controller,
  Delete,
  HttpCode,
  HttpStatus,
  Param,
  Post,
} from '@nestjs/common';
import { ConnectionDto } from './connection.dto.js';
import {
  ConnectionsService,
  type ConnectionResult,
  type DisconnectResult,
} from './connections.service.js';

@Controller('api/connections')
export class ConnectionsController {
  constructor(private readonly connectionsService: ConnectionsService) {}

  @Post('test')
  @HttpCode(HttpStatus.OK)
  testConnection(
    @Body() connection: ConnectionDto,
  ): Promise<ConnectionResult> {
    return this.connectionsService.testConnection(connection);
  }

  @Post()
  createSession(
    @Body() connection: ConnectionDto,
  ): Promise<ConnectionResult & { connectionId: string }> {
    return this.connectionsService.createSession(connection);
  }

  @Delete(':connectionId')
  disconnect(
    @Param('connectionId') connectionId: string,
  ): Promise<DisconnectResult> {
    return this.connectionsService.disconnect(connectionId);
  }
}
