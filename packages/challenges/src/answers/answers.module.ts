import { Module } from '@nestjs/common';
import { AnswersService } from './answers.service';
import { AnswersResolver } from './answers.resolver';
import { PrismaService } from '../prisma.service';
import { PaginateService } from '../paginate.service';

@Module({
  providers: [AnswersResolver, AnswersService, PrismaService, PaginateService],
})
export class AnswersModule {}
