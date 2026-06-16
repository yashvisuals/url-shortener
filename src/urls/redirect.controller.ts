import { Controller, Get, Param, Redirect, Req } from '@nestjs/common';
import { ApiExcludeController } from '@nestjs/swagger';
import type { Request } from 'express';
import { UrlsService } from './urls.service';

@ApiExcludeController()
@Controller()
export class RedirectController {
  constructor(private readonly urlsService: UrlsService) {}

  @Get(':slug')
  @Redirect()
  async redirect(@Param('slug') slug: string, @Req() req: Request) {
    const url = await this.urlsService.resolveAndTrack(slug, {
      ipAddress: req.ip,
      userAgent: req.headers['user-agent'] ?? null,
      referer: req.headers['referer'] ?? null,
    });
    return { url, statusCode: 302 };
  }
}
