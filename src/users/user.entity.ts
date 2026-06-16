import { Field, Int, ObjectType } from '@nestjs/graphql';
import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ShortUrl } from '../urls/entities/short-url.entity';

@ObjectType({ description: 'A registered account that owns short URLs.' })
@Entity('users')
export class User {
  @Field(() => Int, { description: 'Unique user id.' })
  @PrimaryGeneratedColumn()
  id: number;

  @Field({ description: 'Email address used to log in.' })
  @Index({ unique: true })
  @Column({ length: 255 })
  email: string;

  // bcrypt hash — never exposed via GraphQL (no @Field).
  @Column()
  password: string;

  @Field({ description: 'When the account was created.' })
  @CreateDateColumn()
  createdAt: Date;

  @OneToMany(() => ShortUrl, (url) => url.owner)
  urls: ShortUrl[];
}
