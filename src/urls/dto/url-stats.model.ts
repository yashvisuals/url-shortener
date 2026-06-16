import { Field, Int, ObjectType } from '@nestjs/graphql';

@ObjectType({ description: 'A single recorded visit to a short URL.' })
export class ClickInfo {
  @Field(() => String, {
    nullable: true,
    description: 'IP address the click came from.',
  })
  ipAddress?: string | null;

  @Field(() => String, {
    nullable: true,
    description: 'Browser/client user-agent string.',
  })
  userAgent?: string | null;

  @Field(() => String, {
    nullable: true,
    description: 'Referring page, if any.',
  })
  referer?: string | null;

  @Field({ description: 'When the click happened.' })
  clickedAt: Date;
}

@ObjectType({ description: 'Click analytics for one short URL.' })
export class UrlStats {
  @Field({ description: 'The short code.' })
  slug: string;

  @Field({ description: 'The destination URL.' })
  originalUrl: string;

  @Field({ description: 'The full short URL (BASE_URL + /r/ + slug).' })
  shortUrl: string;

  @Field(() => Int, { description: 'Total clicks recorded.' })
  totalClicks: number;

  @Field({ description: 'When the short URL was created.' })
  createdAt: Date;

  @Field(() => [ClickInfo], { description: 'Up to the 10 most recent clicks.' })
  recentClicks: ClickInfo[];
}
