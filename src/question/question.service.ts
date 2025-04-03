import { Injectable } from '@nestjs/common';
import { CreateNewQuestionInput } from './dtos/create-new-question.dto';
import { GetQuestionBySlugInput } from './dtos/get-question-by-slug.dto';
import { QuestionRepository } from './question.repository';
import { EditQuestionInput } from './dtos/edit-question.dto';
import { AnswerQuestionInput } from './dtos/answer-question.dto';
import { CommentOnQuestionInput } from './dtos/comment-on-question.dto';
import { ListCommentsByQuestionInput } from './dtos/list-comments-by-question.dto';
import { RedisService } from 'src/redis/redis.service';

@Injectable()
export class QuestionService {
  private readonly CACHE_TTL = process.env.REDIS_TTL;
  private readonly USER_CACHE_KEY = 'user:';

  constructor(
    private questionRepository: QuestionRepository,
    private redisService: RedisService,
  ) {}

  async getAllQuestions({
    userId,
    page = 1,
  }: {
    userId: string;
    page: number;
  }) {
    const cacheKey = `${this.USER_CACHE_KEY}${userId}`;
    const cachedUser = await this.redisService.get(cacheKey);

    if (cachedUser) return cachedUser;

    const questionData = await this.questionRepository.getAllQuestions({
      userId,
      page,
    });

    await this.redisService.set(
      cacheKey,
      questionData,
      parseInt(this.CACHE_TTL),
    );

    return questionData;
  }

  async getQuestionBySlug(input: GetQuestionBySlugInput, userId: string) {
    const { slug } = input;
    return this.questionRepository.getQuestionBySlug({ slug, userId });
  }

  async createNewQuestion({
    userId,
    input,
  }: {
    userId: string;
    input: CreateNewQuestionInput;
  }) {
    return this.questionRepository.createNewQuestion({ input, userId });
  }

  async editQuestion(input: EditQuestionInput) {
    return this.questionRepository.editQuestion(input);
  }

  async deleteQuestion(id: string) {
    return this.questionRepository.deleteQuestion(id);
  }

  async answerQuestion({
    input,
    userId,
  }: {
    input: AnswerQuestionInput;
    userId: string;
  }) {
    return this.questionRepository.answerQuestion({ input, userId });
  }

  async commentOnQuestion({
    input,
    userId,
  }: {
    input: CommentOnQuestionInput;
    userId: string;
  }) {
    return this.questionRepository.commentOnQuestion({ input, userId });
  }

  async deleteCommentOnQuestion({
    input,
    userId,
  }: {
    input: { commentId: string };
    userId: string;
  }) {
    return this.questionRepository.deleteCommentOnQuestion({ input, userId });
  }

  async listCommentsByQuestion({
    input,
  }: {
    input: ListCommentsByQuestionInput;
  }) {
    return this.questionRepository.listCommentsByQuestion({ input });
  }
}
