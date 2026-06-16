import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from './../src/app.module';

const gql = '/graphql';

describe('URL Shortener (e2e)', () => {
  let app: INestApplication<App>;
  let token: string;
  let slug: string;

  // Unique email per run so re-runs don't collide on the unique constraint.
  const email = `e2e_${Date.now()}@example.com`;
  const password = 'secret123';

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    // Mirror the global pipe configured in main.ts.
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
      }),
    );
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('GET /health returns ok', () => {
    return request(app.getHttpServer())
      .get('/health')
      .expect(200)
      .expect((res) => {
        expect(res.body.status).toBe('ok');
      });
  });

  it('registers a user and returns a token', async () => {
    const res = await request(app.getHttpServer())
      .post(gql)
      .send({
        query: `mutation ($input: AuthInput!) {
          register(input: $input) { accessToken }
        }`,
        variables: { input: { email, password } },
      })
      .expect(200);

    token = res.body.data.register.accessToken;
    expect(typeof token).toBe('string');
    expect(token.length).toBeGreaterThan(20);
  });

  it('rejects createUrl without a token', async () => {
    const res = await request(app.getHttpServer())
      .post(gql)
      .send({
        query: `mutation ($input: CreateUrlInput!) {
          createUrl(input: $input) { slug }
        }`,
        variables: { input: { originalUrl: 'https://nestjs.com' } },
      })
      .expect(200);

    expect(res.body.data).toBeNull();
    expect(res.body.errors[0].message).toContain('Unauthorized');
  });

  it('creates a short URL with a token', async () => {
    const res = await request(app.getHttpServer())
      .post(gql)
      .set('Authorization', `Bearer ${token}`)
      .send({
        query: `mutation ($input: CreateUrlInput!) {
          createUrl(input: $input) { slug originalUrl clickCount }
        }`,
        variables: { input: { originalUrl: 'https://nestjs.com' } },
      })
      .expect(200);

    slug = res.body.data.createUrl.slug;
    expect(slug).toHaveLength(7);
    expect(res.body.data.createUrl.clickCount).toBe(0);
  });

  it('redirects /r/:slug and records the click', async () => {
    await request(app.getHttpServer())
      .get(`/r/${slug}`)
      .expect(302)
      .expect('Location', 'https://nestjs.com');
  });

  it('reports the click in urlStats', async () => {
    const res = await request(app.getHttpServer())
      .post(gql)
      .set('Authorization', `Bearer ${token}`)
      .send({
        query: `query ($slug: String!) {
          urlStats(slug: $slug) { totalClicks recentClicks { ipAddress } }
        }`,
        variables: { slug },
      })
      .expect(200);

    expect(res.body.data.urlStats.totalClicks).toBe(1);
    expect(res.body.data.urlStats.recentClicks).toHaveLength(1);
  });
});
