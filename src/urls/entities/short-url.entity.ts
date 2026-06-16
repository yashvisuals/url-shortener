import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from '../../users/user.entity';
import { ClickEvent } from './click-event.entity';

@Entity('short_urls')
export class ShortUrl {
  @PrimaryGeneratedColumn()
  id: number;

  @Index({ unique: true })
  @Column({ length: 16 })
  slug: string;

  @Column({ type: 'text' })
  originalUrl: string;

  @Column({ default: 0 })
  clickCount: number;

  @CreateDateColumn()
  createdAt: Date;

  // Nullable so links created before auth (or anonymous ones) still work.
  @ManyToOne(() => User, (user) => user.urls, { nullable: true, onDelete: 'CASCADE' })
  owner: User | null;

  @Column({ nullable: true })
  ownerId: number | null;

  @OneToMany(() => ClickEvent, (event) => event.shortUrl)
  clicks: ClickEvent[];
}
