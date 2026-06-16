import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, IsUrl, Length, Matches } from 'class-validator';

export class CreateUrlDto {
  @ApiProperty({ example: 'https://example.com/some/very/long/path' })
  @IsUrl({ require_protocol: true })
  originalUrl: string;

  @ApiPropertyOptional({
    example: 'my-link',
    description: 'Optional custom slug (3-16 chars, letters/numbers/-/_)',
  })
  @IsOptional()
  @IsString()
  @Length(3, 16)
  @Matches(/^[A-Za-z0-9_-]+$/, {
    message: 'slug may only contain letters, numbers, hyphens and underscores',
  })
  customSlug?: string;
}
