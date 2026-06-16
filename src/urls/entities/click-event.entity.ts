import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ShortUrl } from './short-url.entity';

@Entity('click_events')
export class ClickEvent {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => ShortUrl, (url) => url.clicks, { onDelete: 'CASCADE' })
  shortUrl: ShortUrl;

  @Column({ type: 'varchar', length: 45, nullable: true })
  ipAddress: string | null;

  @Column({ type: 'text', nullable: true })
  userAgent: string | null;

  @Column({ type: 'text', nullable: true })
  referer: string | null;

  @CreateDateColumn()
  createdAt: Date;
}
