import { Module } from '@nestjs/common';

import { PrismaService } from 'src/prisma.service';
import { PaginateService } from 'src/paginate.service';

import { ChallengesService } from './challenges.service';
import { ChallengesResolver } from './challenges.resolver';

@Module({
  providers: [
    ChallengesResolver,
    ChallengesService,
    PrismaService,
    PaginateService,
  ],
})
export class ChallengesModule {}
