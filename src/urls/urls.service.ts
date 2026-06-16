import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUrlDto } from './dto/create-url.dto';
import { ClickEvent } from './entities/click-event.entity';
import { ShortUrl } from './entities/short-url.entity';

const SLUG_ALPHABET =
  'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';

export interface ClickContext {
  ipAddress?: string | null;
  userAgent?: string | null;
  referer?: string | null;
}

@Injectable()
export class UrlsService {
  constructor(
    @InjectRepository(ShortUrl)
    private readonly urls: Repository<ShortUrl>,
    @InjectRepository(ClickEvent)
    private readonly clicks: Repository<ClickEvent>,
    private readonly config: ConfigService,
  ) {}

  async create(dto: CreateUrlDto): Promise<ShortUrl & { shortUrl: string }> {
    let slug = dto.customSlug;

    if (slug) {
      const exists = await this.urls.findOne({ where: { slug } });
      if (exists) {
        throw new ConflictException(`slug "${slug}" is already taken`);
      }
    } else {
      slug = await this.generateUniqueSlug();
    }

    const entity = this.urls.create({ slug, originalUrl: dto.originalUrl });
    const saved = await this.urls.save(entity);
    return { ...saved, shortUrl: this.buildShortUrl(saved.slug) };
  }

  findAll(): Promise<ShortUrl[]> {
    return this.urls.find({ order: { createdAt: 'DESC' } });
  }

  /** Resolve a slug to its target URL and record a click event. */
  async resolveAndTrack(slug: string, ctx: ClickContext): Promise<string> {
    const url = await this.urls.findOne({ where: { slug } });
    if (!url) {
      throw new NotFoundException(`no URL found for slug "${slug}"`);
    }

    await this.urls.increment({ id: url.id }, 'clickCount', 1);
    await this.clicks.save(
      this.clicks.create({
        shortUrl: url,
        ipAddress: ctx.ipAddress ?? null,
        userAgent: ctx.userAgent ?? null,
        referer: ctx.referer ?? null,
      }),
    );

    return url.originalUrl;
  }

  async getStats(slug: string) {
    const url = await this.urls.findOne({ where: { slug } });
    if (!url) {
      throw new NotFoundException(`no URL found for slug "${slug}"`);
    }

    const recent = await this.clicks.find({
      where: { shortUrl: { id: url.id } },
      order: { createdAt: 'DESC' },
      take: 10,
    });

    return {
      slug: url.slug,
      originalUrl: url.originalUrl,
      shortUrl: this.buildShortUrl(url.slug),
      totalClicks: url.clickCount,
      createdAt: url.createdAt,
      recentClicks: recent.map((c) => ({
        ipAddress: c.ipAddress,
        userAgent: c.userAgent,
        referer: c.referer,
        clickedAt: c.createdAt,
      })),
    };
  }

  private async generateUniqueSlug(): Promise<string> {
    // Retry on the rare collision rather than assuming uniqueness.
    for (let attempt = 0; attempt < 5; attempt++) {
      const slug = this.randomSlug(7);
      const exists = await this.urls.findOne({ where: { slug } });
      if (!exists) return slug;
    }
    throw new ConflictException('could not generate a unique slug, try again');
  }

  private randomSlug(length: number): string {
    let out = '';
    for (let i = 0; i < length; i++) {
      out += SLUG_ALPHABET[Math.floor(Math.random() * SLUG_ALPHABET.length)];
    }
    return out;
  }

  private buildShortUrl(slug: string): string {
    const base = this.config.get<string>('BASE_URL', 'http://localhost:3000');
    return `${base.replace(/\/$/, '')}/${slug}`;
  }
}
