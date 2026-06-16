import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CreateUrlDto } from './dto/create-url.dto';
import { UrlsService } from './urls.service';

@ApiTags('urls')
@Controller('urls')
export class UrlsController {
  constructor(private readonly urlsService: UrlsService) {}

  @Post()
  create(@Body() dto: CreateUrlDto) {
    return this.urlsService.create(dto);
  }

  @Get()
  findAll() {
    return this.urlsService.findAll();
  }

  @Get(':slug/stats')
  getStats(@Param('slug') slug: string) {
    return this.urlsService.getStats(slug);
  }
}
