import { IsString } from 'class-validator';

export class CreateNewQuestionInput {
  @IsString({ message: 'title is missing' })
  title: string;

  @IsString({ message: 'slug is missing' })
  slug: string;

  @IsString({ message: 'content is missing' })
  content: string;
}
