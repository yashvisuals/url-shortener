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

@ObjectType()
@Entity('short_urls')
export class ShortUrl {
  @Field(() => Int)
  @PrimaryGeneratedColumn()
  id: number;

  @Field()
  @Index({ unique: true })
  @Column({ length: 16 })
  slug: string;

  @Field()
  @Column({ type: 'text' })
  originalUrl: string;

  @Field(() => Int)
  @Column({ default: 0 })
  clickCount: number;

  @Field()
  @CreateDateColumn()
  createdAt: Date;

  // Nullable so links created before auth (or anonymous ones) still work.
  @ManyToOne(() => User, (user) => user.urls, {
    nullable: true,
    onDelete: 'CASCADE',
  })
  owner: User | null;

  @Field(() => Int, { nullable: true })
  @Column({ nullable: true })
  ownerId: number | null;

  @OneToMany(() => ClickEvent, (event) => event.shortUrl)
  clicks: ClickEvent[];
}
