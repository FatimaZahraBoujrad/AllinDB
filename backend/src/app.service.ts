import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    return 'AllinDB API';
  }

  getHealth(): { status: 'ok'; service: 'allindb-api' } {
    return { status: 'ok', service: 'allindb-api' };
  }
}
