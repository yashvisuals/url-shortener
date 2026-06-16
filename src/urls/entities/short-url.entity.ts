import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
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

  @OneToMany(() => ClickEvent, (event) => event.shortUrl)
  clicks: ClickEvent[];
}
