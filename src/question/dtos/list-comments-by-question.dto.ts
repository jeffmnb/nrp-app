import { IsString } from 'class-validator';

export class ListCommentsByQuestionInput {
  @IsString()
  questionId: string;

  @IsString()
  page: string;
}
