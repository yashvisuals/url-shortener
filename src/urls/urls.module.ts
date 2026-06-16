import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from '../auth/auth.module';
import { User } from '../users/user.entity';
import { ClickEvent } from './entities/click-event.entity';
import { ShortUrl } from './entities/short-url.entity';
import { RedirectController } from './redirect.controller';
import { UrlsController } from './urls.controller';
import { UrlsService } from './urls.service';

@Module({
  imports: [TypeOrmModule.forFeature([ShortUrl, ClickEvent, User]), AuthModule],
  controllers: [UrlsController, RedirectController],
  providers: [UrlsService],
})
export class UrlsModule {}
