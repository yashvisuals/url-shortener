import { ConfigService } from '@nestjs/config';
import { ConflictException, ForbiddenException, NotFoundException } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../users/user.entity';
import { ClickEvent } from './entities/click-event.entity';
import { ShortUrl } from './entities/short-url.entity';
import { UrlsService } from './urls.service';

const owner = { id: 1, email: 'a@b.com' } as User;

describe('UrlsService', () => {
  let service: UrlsService;
  let urls: jest.Mocked<
    Pick<Repository<ShortUrl>, 'findOne' | 'find' | 'create' | 'save' | 'increment'>
  >;
  let clicks: jest.Mocked<Pick<Repository<ClickEvent>, 'find' | 'create' | 'save'>>;

  beforeEach(async () => {
    urls = {
      findOne: jest.fn(),
      find: jest.fn(),
      create: jest.fn((dto) => dto as ShortUrl),
      save: jest.fn(async (u) => ({ ...(u as ShortUrl), id: 99 })),
      increment: jest.fn(),
    };
    clicks = {
      find: jest.fn(),
      create: jest.fn((dto) => dto as ClickEvent),
      save: jest.fn(),
    };

    const moduleRef = await Test.createTestingModule({
      providers: [
        UrlsService,
        { provide: getRepositoryToken(ShortUrl), useValue: urls },
        { provide: getRepositoryToken(ClickEvent), useValue: clicks },
        {
          provide: ConfigService,
          useValue: { get: jest.fn(() => 'http://localhost:3000') },
        },
      ],
    }).compile();

    service = moduleRef.get(UrlsService);
  });

  describe('create', () => {
    it('uses a custom slug when available and builds the short URL', async () => {
      urls.findOne.mockResolvedValue(null);

      const result = await service.create(
        { originalUrl: 'https://x.com', customSlug: 'my-link' },
        owner,
      );

      expect(result.slug).toBe('my-link');
      expect(result.ownerId).toBe(owner.id);
      expect(result.shortUrl).toBe('http://localhost:3000/r/my-link');
    });

    it('rejects a taken custom slug', async () => {
      urls.findOne.mockResolvedValue({ id: 1, slug: 'taken' } as ShortUrl);

      await expect(
        service.create({ originalUrl: 'https://x.com', customSlug: 'taken' }, owner),
      ).rejects.toBeInstanceOf(ConflictException);
    });

    it('generates a random slug when none is provided', async () => {
      urls.findOne.mockResolvedValue(null);

      const result = await service.create({ originalUrl: 'https://x.com' }, owner);

      expect(result.slug).toHaveLength(7);
    });
  });

  describe('resolveAndTrack', () => {
    it('increments the count, records a click, and returns the target', async () => {
      urls.findOne.mockResolvedValue({
        id: 5,
        slug: 's',
        originalUrl: 'https://x.com',
      } as ShortUrl);

      const target = await service.resolveAndTrack('s', { ipAddress: '1.2.3.4' });

      expect(target).toBe('https://x.com');
      expect(urls.increment).toHaveBeenCalledWith({ id: 5 }, 'clickCount', 1);
      expect(clicks.save).toHaveBeenCalled();
    });

    it('throws when the slug is unknown', async () => {
      urls.findOne.mockResolvedValue(null);

      await expect(service.resolveAndTrack('nope', {})).rejects.toBeInstanceOf(
        NotFoundException,
      );
    });
  });

  describe('getStats', () => {
    it('forbids access to a URL owned by someone else', async () => {
      urls.findOne.mockResolvedValue({ id: 5, slug: 's', ownerId: 2 } as ShortUrl);

      await expect(service.getStats('s', owner)).rejects.toBeInstanceOf(
        ForbiddenException,
      );
    });

    it('returns stats for the owner', async () => {
      urls.findOne.mockResolvedValue({
        id: 5,
        slug: 's',
        originalUrl: 'https://x.com',
        ownerId: owner.id,
        clickCount: 3,
        createdAt: new Date(),
      } as ShortUrl);
      clicks.find.mockResolvedValue([]);

      const stats = await service.getStats('s', owner);

      expect(stats.totalClicks).toBe(3);
      expect(stats.shortUrl).toBe('http://localhost:3000/r/s');
    });
  });
});
