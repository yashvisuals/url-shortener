import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClickEvent } from './entities/click-event.entity';
import { ShortUrl } from './entities/short-url.entity';
import { RedirectController } from './redirect.controller';
import { UrlsController } from './urls.controller';
import { UrlsService } from './urls.service';

@Module({
  imports: [TypeOrmModule.forFeature([ShortUrl, ClickEvent])],
  controllers: [UrlsController, RedirectController],
  providers: [UrlsService],
})
export class UrlsModule {}
