import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ShortUrl } from '../urls/entities/short-url.entity';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Index({ unique: true })
  @Column({ length: 255 })
  email: string;

  // bcrypt hash — never the plaintext password.
  @Column()
  password: string;

  @CreateDateColumn()
  createdAt: Date;

  @OneToMany(() => ShortUrl, (url) => url.owner)
  urls: ShortUrl[];
}
