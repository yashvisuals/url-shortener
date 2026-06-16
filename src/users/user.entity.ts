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

@ObjectType()
@Entity('users')
export class User {
  @Field(() => Int)
  @PrimaryGeneratedColumn()
  id: number;

  @Field()
  @Index({ unique: true })
  @Column({ length: 255 })
  email: string;

  // bcrypt hash — never exposed via GraphQL (no @Field).
  @Column()
  password: string;

  @Field()
  @CreateDateColumn()
  createdAt: Date;

  @OneToMany(() => ShortUrl, (url) => url.owner)
  urls: ShortUrl[];
}
