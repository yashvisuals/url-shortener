import { Field, Int, ObjectType } from '@nestjs/graphql';
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

@ObjectType({ description: 'A shortened URL and its click counter.' })
@Entity('short_urls')
export class ShortUrl {
  @Field(() => Int, { description: 'Unique short URL id.' })
  @PrimaryGeneratedColumn()
  id: number;

  @Field({ description: 'Short code used in the redirect path (/r/:slug).' })
  @Index({ unique: true })
  @Column({ length: 16 })
  slug: string;

  @Field({ description: 'The destination the slug redirects to.' })
  @Column({ type: 'text' })
  originalUrl: string;

  @Field(() => Int, { description: 'Total number of times the link was visited.' })
  @Column({ default: 0 })
  clickCount: number;

  @Field({ description: 'When the short URL was created.' })
  @CreateDateColumn()
  createdAt: Date;

  // Nullable so links created before auth (or anonymous ones) still work.
  @ManyToOne(() => User, (user) => user.urls, {
    nullable: true,
    onDelete: 'CASCADE',
  })
  owner: User | null;

  @Field(() => Int, {
    nullable: true,
    description: 'Id of the user who owns this link.',
  })
  @Column({ nullable: true })
  ownerId: number | null;

  @OneToMany(() => ClickEvent, (event) => event.shortUrl)
  clicks: ClickEvent[];
}
