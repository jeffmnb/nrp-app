import { IsEmail, IsString, MinLength } from 'class-validator';

export class SignInInput {
  @IsEmail()
  email: string;

  @MinLength(6)
  @IsString()
  password: string;
}
