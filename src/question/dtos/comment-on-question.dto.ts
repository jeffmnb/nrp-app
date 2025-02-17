import { IsString } from 'class-validator';

export class CommentOnQuestionInput {
  @IsString()
  comment: string;

  @IsString()
  questionId: string;
}
