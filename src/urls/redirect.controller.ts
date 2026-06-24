import { Controller, Get, NotFoundException, Param, Redirect, Req } from '@nestjs/common';
import { ApiExcludeController } from '@nestjs/swagger';
import type { Request } from 'express';
import { UrlsService } from './urls.service';

// Paths that must NOT be treated as slugs. Anything matching one of these
// reserved prefixes falls through to its real handler instead of trying to
// resolve as a short URL.
const RESERVED_PREFIXES = new Set([
  'health',
  'graphql',
  'auth',
  'urls',
  'providers',
  'favicon.ico',
  'robots.txt',
]);

@ApiExcludeController()
@Controller()
export class RedirectController {
  constructor(private readonly urlsService: UrlsService) {}

  // Backwards-compat: old links still work on /r/:slug
  @Get('r/:slug')
  @Redirect()
  async redirectLegacy(@Param('slug') slug: string, @Req() req: Request) {
    return this.handle(slug, req);
  }

  // Short URLs now live at the root: yshx.onrender.com/aB3X
  @Get(':slug')
  @Redirect()
  async redirect(@Param('slug') slug: string, @Req() req: Request) {
    if (RESERVED_PREFIXES.has(slug.toLowerCase())) {
      throw new NotFoundException();
    }
    return this.handle(slug, req);
  }

  private async handle(slug: string, req: Request) {
    const url = await this.urlsService.resolveAndTrack(slug, {
      ipAddress: req.ip,
      userAgent: req.headers['user-agent'] ?? null,
      referer: req.headers['referer'] ?? null,
    });
    return { url, statusCode: 302 };
  }
}
