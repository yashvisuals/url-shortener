import { Field, Int, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class ClickInfo {
  @Field(() => String, { nullable: true })
  ipAddress?: string | null;

  @Field(() => String, { nullable: true })
  userAgent?: string | null;

  @Field(() => String, { nullable: true })
  referer?: string | null;

  @Field()
  clickedAt: Date;
}

@ObjectType()
export class UrlStats {
  @Field()
  slug: string;

  @Field()
  originalUrl: string;

  @Field()
  shortUrl: string;

  @Field(() => Int)
  totalClicks: number;

  @Field()
  createdAt: Date;

  @Field(() => [ClickInfo])
  recentClicks: ClickInfo[];
}
