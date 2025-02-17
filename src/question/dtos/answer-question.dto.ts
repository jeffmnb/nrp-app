import { IsString } from 'class-validator';

export class AnswerQuestionInput {
  @IsString()
  questionId: string;

  @IsString()
  content: string;
}
