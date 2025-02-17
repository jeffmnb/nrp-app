import { IsString } from 'class-validator';

export class EditQuestionInput {
  @IsString({ message: 'title is missing' })
  title: string;

  @IsString({ message: 'slug is missing' })
  slug: string;

  @IsString({ message: 'content is missing' })
  content: string;

  @IsString()
  id: string;
}
