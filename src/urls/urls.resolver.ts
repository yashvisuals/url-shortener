import { UseGuards } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { GetUser } from '../auth/get-user.decorator';
import { GqlAuthGuard } from '../auth/gql-auth.guard';
import { User } from '../users/user.entity';
import { CreateUrlInput } from './dto/create-url.input';
import { UrlStats } from './dto/url-stats.model';
import { ShortUrl } from './entities/short-url.entity';
import { UrlsService } from './urls.service';

@Resolver(() => ShortUrl)
@UseGuards(GqlAuthGuard)
export class UrlsResolver {
  constructor(private readonly urlsService: UrlsService) {}

  @Mutation(() => ShortUrl)
  createUrl(@Args('input') input: CreateUrlInput, @GetUser() user: User) {
    return this.urlsService.create(input, user);
  }

  @Query(() => [ShortUrl], { name: 'myUrls' })
  myUrls(@GetUser() user: User) {
    return this.urlsService.findAllForUser(user);
  }

  @Query(() => UrlStats, { name: 'urlStats' })
  urlStats(@Args('slug') slug: string, @GetUser() user: User) {
    return this.urlsService.getStats(slug, user);
  }
}
