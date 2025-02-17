import { IsEmail, IsString } from 'class-validator';

export class SignUpInput {
  @IsString()
  name: string;

  @IsEmail()
  email: string;

  @IsString()
  password: string;
}
