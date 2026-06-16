import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  health() {
    return {
      status: 'ok',
      service: 'url-shortener',
      uptime: process.uptime(),
    };
  }
}
