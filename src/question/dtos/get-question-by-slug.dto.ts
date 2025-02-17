import { IsString } from 'class-validator';

export class GetQuestionBySlugInput {
  @IsString()
  slug: string;
}
