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

  @Mutation(() => ShortUrl, {
    description: 'Create a short URL owned by the current user.',
  })
  createUrl(@Args('input') input: CreateUrlInput, @GetUser() user: User) {
    return this.urlsService.create(input, user);
  }

  @Query(() => [ShortUrl], {
    name: 'myUrls',
    description: 'List the short URLs owned by the current user.',
  })
  myUrls(@GetUser() user: User) {
    return this.urlsService.findAllForUser(user);
  }

  @Query(() => UrlStats, {
    name: 'urlStats',
    description: 'Click analytics for one of your short URLs.',
  })
  urlStats(
    @Args('slug', { description: 'The slug to fetch stats for.' }) slug: string,
    @GetUser() user: User,
  ) {
    return this.urlsService.getStats(slug, user);
  }
}
