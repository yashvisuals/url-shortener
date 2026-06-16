import { ConflictException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { Repository } from 'typeorm';
import { User } from '../users/user.entity';
import { AuthService } from './auth.service';

describe('AuthService', () => {
  let service: AuthService;
  let users: jest.Mocked<Pick<Repository<User>, 'findOne' | 'create' | 'save'>>;

  beforeEach(async () => {
    users = {
      findOne: jest.fn(),
      create: jest.fn((dto) => dto as User),
      save: jest.fn(),
    };

    const moduleRef = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: getRepositoryToken(User), useValue: users },
        { provide: JwtService, useValue: { sign: jest.fn(() => 'signed.jwt') } },
      ],
    }).compile();

    service = moduleRef.get(AuthService);
  });

  describe('register', () => {
    it('hashes the password and returns a token', async () => {
      users.findOne.mockResolvedValue(null);
      users.save.mockImplementation(async (u) => ({ ...(u as User), id: 1 }));

      const result = await service.register({
        email: 'a@b.com',
        password: 'secret123',
      });

      expect(result).toEqual({ accessToken: 'signed.jwt' });
      const saved = users.save.mock.calls[0][0] as User;
      expect(saved.password).not.toBe('secret123'); // stored as a hash
      expect(await bcrypt.compare('secret123', saved.password)).toBe(true);
    });

    it('rejects a duplicate email', async () => {
      users.findOne.mockResolvedValue({ id: 1, email: 'a@b.com' } as User);

      await expect(
        service.register({ email: 'a@b.com', password: 'secret123' }),
      ).rejects.toBeInstanceOf(ConflictException);
    });
  });

  describe('login', () => {
    it('returns a token for valid credentials', async () => {
      const password = await bcrypt.hash('secret123', 10);
      users.findOne.mockResolvedValue({ id: 1, email: 'a@b.com', password } as User);

      const result = await service.login({
        email: 'a@b.com',
        password: 'secret123',
      });

      expect(result).toEqual({ accessToken: 'signed.jwt' });
    });

    it('rejects an unknown email', async () => {
      users.findOne.mockResolvedValue(null);

      await expect(
        service.login({ email: 'no@b.com', password: 'secret123' }),
      ).rejects.toBeInstanceOf(UnauthorizedException);
    });

    it('rejects a wrong password', async () => {
      const password = await bcrypt.hash('correct-password', 10);
      users.findOne.mockResolvedValue({ id: 1, email: 'a@b.com', password } as User);

      await expect(
        service.login({ email: 'a@b.com', password: 'wrong-password' }),
      ).rejects.toBeInstanceOf(UnauthorizedException);
    });
  });
});
