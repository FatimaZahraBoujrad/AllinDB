import { Module } from '@nestjs/common';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { ConnectionsModule } from './connections/connections.module.js';

@Module({
  imports: [ConnectionsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
