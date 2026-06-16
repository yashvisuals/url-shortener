import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { IsEmail, IsString, MinLength } from 'class-validator';

@InputType({ description: 'Credentials for registering or logging in.' })
export class AuthInput {
  @Field({ description: 'A valid email address.' })
  @IsEmail()
  email: string;

  @Field({ description: 'Password, at least 6 characters.' })
  @IsString()
  @MinLength(6)
  password: string;
}

@ObjectType({ description: 'Returned after a successful register or login.' })
export class AuthPayload {
  @Field({ description: 'JWT to send as `Authorization: Bearer <token>`.' })
  accessToken: string;
}
