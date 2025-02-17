import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateNewQuestionInput } from './dtos/create-new-question.dto';
import { v4 as uuid } from 'uuid';
import { EditQuestionInput } from './dtos/edit-question.dto';
import { AnswerQuestionInput } from './dtos/answer-question.dto';
import { CommentOnQuestionInput } from './dtos/comment-on-question.dto';
import { ListCommentsByQuestionInput } from './dtos/list-comments-by-question.dto';

@Injectable()
export class QuestionRepository {
  constructor(private prismaService: PrismaService) {}

  async getQuestionById(id: string) {
    const question = await this.prismaService.question.findUnique({
      where: { id },
    });
    if (!question) throw new NotFoundException('Question not found');
    return question;
  }

  async getAllQuestions({
    userId,
    page = 1,
  }: {
    userId: string;
    page: number;
  }) {
    const perPage = 3;
    return await this.prismaService.question
      .findMany({
        where: { authorId: userId },
        orderBy: { createdAt: 'desc' },
        take: perPage,
        skip: (page - 1) * perPage,
      })
      .catch(() => console.log('error on get all questions'));
  }

  async getQuestionBySlug({ slug, userId }: { slug: string; userId: string }) {
    return await this.prismaService.question
      .findFirst({
        where: {
          slug: { mode: 'insensitive', contains: slug },
          authorId: userId,
        },
      })
      .catch(() => console.log('error on get question by slug'));
  }

  async createNewQuestion({
    userId,
    input,
  }: {
    userId: string;
    input: CreateNewQuestionInput;
  }) {
    const { title, slug, content } = input;
    if (await this.getQuestionBySlug({ slug, userId }))
      throw new ConflictException('question with same slug already exists');
    return await this.prismaService.question
      .create({
        data: {
          id: uuid(),
          title,
          slug,
          content,
          authorId: userId,
        },
      })
      .catch(() => {
        console.log('error on create new question');
      });
  }

  async editQuestion(input: EditQuestionInput) {
    const { id, content, slug, title } = input;
    this.getQuestionById(id);
    return this.prismaService.question.update({
      where: { id: id },
      data: { content, slug, title },
    });
  }

  async deleteQuestion(id: string) {
    await this.getQuestionById(id);
    return await this.prismaService.question.delete({ where: { id } });
  }

  async answerQuestion({
    input,
    userId,
  }: {
    input: AnswerQuestionInput;
    userId: string;
  }) {
    const { questionId, content } = input;
    await this.getQuestionById(questionId);
    await this.prismaService.answer.create({
      data: { content, authorId: userId, questionId },
    });
  }

  async commentOnQuestion({
    input,
    userId,
  }: {
    input: CommentOnQuestionInput;
    userId: string;
  }) {
    const { comment, questionId } = input;
    await this.getQuestionById(questionId);
    await this.prismaService.comment.create({
      data: {
        content: comment,
        authorId: userId,
        questionId: questionId,
      },
    });
  }

  async deleteCommentOnQuestion({
    input,
    userId,
  }: {
    input: { commentId: string };
    userId: string;
  }) {
    const { commentId } = input;
    await this.prismaService.comment.delete({
      where: { id: commentId, authorId: userId },
    });
  }

  async listCommentsByQuestion({
    input,
  }: {
    input: ListCommentsByQuestionInput;
  }) {
    const { questionId, page } = input;
    const questionComment = await this.prismaService.comment.findMany({
      where: { questionId },
      include: { author: true },
      orderBy: { createdAt: 'desc' },
      take: 20,
      skip: (Number(page) - 1) * 20,
    });
    return questionComment;
  }
}
