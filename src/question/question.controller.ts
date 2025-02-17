import {
  Controller,
  Delete,
  Get,
  HttpCode,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { JwtGuard } from 'src/auth/auth.guard';
import { GetAuth } from 'src/decorators/get-auth';
import { UnifiedRequestData } from 'src/decorators/unifield-request-data';
import { CreateNewQuestionInput } from './dtos/create-new-question.dto';
import { QuestionService } from './question.service';
import { GetQuestionBySlugInput } from './dtos/get-question-by-slug.dto';
import { EditQuestionInput } from './dtos/edit-question.dto';
import { AnswerQuestionInput } from './dtos/answer-question.dto';
import { CommentOnQuestionInput } from './dtos/comment-on-question.dto';
import { ListCommentsByQuestionInput } from './dtos/list-comments-by-question.dto';

@Controller('/question')
export class QuestionController {
  constructor(private questionService: QuestionService) {}

  @Post('/create')
  @HttpCode(200)
  @UseGuards(JwtGuard)
  createNewQuestion(
    @GetAuth() userId: string,
    @UnifiedRequestData() input: CreateNewQuestionInput,
  ) {
    return this.questionService.createNewQuestion({ userId, input });
  }

  @Get('/all')
  @UseGuards(JwtGuard)
  getAllQuestions(
    @GetAuth() userId: string,
    @UnifiedRequestData() { page }: { page: number },
  ) {
    return this.questionService.getAllQuestions({ userId, page });
  }

  @Get('/slug')
  @UseGuards(JwtGuard)
  getQuestionBySlug(
    @UnifiedRequestData() input: GetQuestionBySlugInput,
    @GetAuth() userId: string,
  ) {
    return this.questionService.getQuestionBySlug(input, userId);
  }

  @Put('/edit/:id')
  @HttpCode(200)
  @UseGuards(JwtGuard)
  editQuestion(@UnifiedRequestData() input: EditQuestionInput) {
    return this.questionService.editQuestion(input);
  }

  @Delete('/:id')
  @HttpCode(204)
  @UseGuards(JwtGuard)
  deleteQuestion(@UnifiedRequestData() { id }: { id: string }) {
    return this.questionService.deleteQuestion(id).catch((err) => {
      throw err;
    });
  }

  @Post('/:questionId/answer')
  @UseGuards(JwtGuard)
  @HttpCode(201)
  answerQuestion(
    @UnifiedRequestData() input: AnswerQuestionInput,
    @GetAuth() userId: string,
  ) {
    return this.questionService.answerQuestion({ input, userId });
  }

  @Post('/:questionId/comment/create')
  @UseGuards(JwtGuard)
  @HttpCode(201)
  commentOnQuestion(
    @UnifiedRequestData() input: CommentOnQuestionInput,
    @GetAuth() userId: string,
  ) {
    return this.questionService.commentOnQuestion({ input, userId });
  }

  @Delete('/:questionId/comment/:commentId/delete')
  @UseGuards(JwtGuard)
  @HttpCode(204)
  deleteCommentOnQuestion(
    @UnifiedRequestData() input: { commentId: string },
    @GetAuth() userId: string,
  ) {
    return this.questionService.deleteCommentOnQuestion({ input, userId });
  }

  @Get('/:questionId/comments/page/:page')
  @UseGuards(JwtGuard)
  listCommentsByQuestion(
    @UnifiedRequestData() input: ListCommentsByQuestionInput,
  ) {
    return this.questionService.listCommentsByQuestion({ input });
  }
}
