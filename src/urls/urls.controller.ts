import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { GetUser } from '../auth/get-user.decorator';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { User } from '../users/user.entity';
import { CreateUrlDto } from './dto/create-url.dto';
import { UrlsService } from './urls.service';

@ApiTags('urls')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('urls')
export class UrlsController {
  constructor(private readonly urlsService: UrlsService) {}

  @Post()
  create(@Body() dto: CreateUrlDto, @GetUser() user: User) {
    return this.urlsService.create(dto, user);
  }

  @Get()
  findAll(@GetUser() user: User) {
    return this.urlsService.findAllForUser(user);
  }

  @Get(':slug/stats')
  getStats(@Param('slug') slug: string, @GetUser() user: User) {
    return this.urlsService.getStats(slug, user);
  }
}
