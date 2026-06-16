import { Field, InputType } from '@nestjs/graphql';
import { IsOptional, IsString, IsUrl, Length, Matches } from 'class-validator';

@InputType()
export class CreateUrlInput {
  @Field()
  @IsUrl({ require_protocol: true })
  originalUrl: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  @Length(3, 16)
  @Matches(/^[A-Za-z0-9_-]+$/, {
    message: 'slug may only contain letters, numbers, hyphens and underscores',
  })
  customSlug?: string;
}
