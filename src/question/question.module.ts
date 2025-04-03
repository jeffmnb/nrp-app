import { Module } from '@nestjs/common';
import { QuestionService } from './question.service';
import { QuestionController } from './question.controller';
import { PrismaService } from 'src/prisma/prisma.service';
import { QuestionRepository } from './question.repository';
import { RedisService } from 'src/redis/redis.service';

@Module({
  providers: [QuestionService, QuestionRepository, PrismaService, RedisService],
  controllers: [QuestionController],
})
export class QuestionModule {}
