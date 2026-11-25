import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';

describe('AppController', () => {
  let appController: AppController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [AppService],
    }).compile();

    appController = app.get<AppController>(AppController);
  });

  describe('root', () => {
    it('should identify the AllinDB API', () => {
      expect(appController.getHello()).toBe('AllinDB API');
    });

    it('should return API health status', () => {
      expect(appController.getHealth()).toEqual({
        status: 'ok',
        service: 'allindb-api',
      });
    });
  });
});
