import { Field, InputType } from '@nestjs/graphql';
import { IsOptional, IsString, IsUrl, Length, Matches } from 'class-validator';

@InputType({ description: 'Input for creating a new short URL.' })
export class CreateUrlInput {
  @Field({ description: 'The URL to shorten (must include http/https).' })
  @IsUrl({ require_protocol: true })
  originalUrl: string;

  @Field({
    nullable: true,
    description:
      'Optional custom slug (3-16 chars: letters, numbers, - or _). A random one is generated if omitted.',
  })
  @IsOptional()
  @IsString()
  @Length(3, 16)
  @Matches(/^[A-Za-z0-9_-]+$/, {
    message: 'slug may only contain letters, numbers, hyphens and underscores',
  })
  customSlug?: string;
}
