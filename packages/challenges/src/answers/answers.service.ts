import { Injectable } from '@nestjs/common';
import { Client, ClientKafka, Transport } from '@nestjs/microservices';
import { Prisma, Submission } from '@prisma/client';
import { UserInputError } from 'apollo-server-express';

import { PaginateService } from '../paginate.service';
import { PrismaService } from '../prisma.service';

import { AnswerChallengeInput } from './dto/answer-challenge.input';
import { QueryAnswersInput } from './dto/query-answers.input';

@Injectable()
export class AnswersService {
  constructor(
    private prisma: PrismaService,
    private paginateService: PaginateService,
  ) {}

  @Client({
    transport: Transport.KAFKA,
    options: {
      client: {
        brokers: ['localhost:9092'],
      },
      consumer: {
        groupId: 'challenge-consumer',
      },
    },
  })
  client: ClientKafka;

  async onModuleInit() {
    this.client.subscribeToResponseOf('challenge.correction');
    await this.client.connect();
  }

  async create(answerChallengeInput: AnswerChallengeInput) {
    await this.validateAnswerChallengeInput(answerChallengeInput);

    const initialSubmission = await this.initSubmission(answerChallengeInput);

    const updatedSubmission = await this.updateSubmissionWithCorretion(
      initialSubmission,
    );

    return updatedSubmission;
  }

  findAll(queryAnswersInput: QueryAnswersInput, page?: number) {
    const pagination = this.paginateService.create(page);

    return this.prisma.submission.findMany({
      where: queryAnswersInput,
      ...pagination,
    });
  }

  async initSubmission(answerChallengeInput: AnswerChallengeInput) {
    const createSubmissionInput: Prisma.SubmissionCreateInput = {
      repositoryLink: answerChallengeInput.repositoryLink,
      grade: 0,
      status: 'Pending',
      challenge: {
        connect: {
          id: answerChallengeInput.challengeId,
        },
      },
    };
    const initialSubmission = await this.prisma.submission.create({
      data: createSubmissionInput,
    });

    return initialSubmission;
  }

  async updateSubmissionWithCorretion(initialSubmission: Submission) {
    const submissionCorrection = await this.produceCorrectionChallenge(
      initialSubmission,
    );

    const updatedSubmission = await this.prisma.submission.update({
      where: { id: submissionCorrection.submissionId },
      data: {
        grade: submissionCorrection.grade,
        status: submissionCorrection.status,
      },
    });

    return updatedSubmission;
  }

  async produceCorrectionChallenge(createdSubmission: Submission) {
    const submissionCorrectionObservable = this.client.send(
      'challenge.correction',
      {
        submissionId: createdSubmission.id,
        repositoryUrl: createdSubmission.repositoryLink,
      },
    );
    let submissionCorrection;
    await submissionCorrectionObservable.forEach((value) => {
      submissionCorrection = value;
    });

    return submissionCorrection;
  }

  async validateAnswerChallengeInput(
    answerChallengeInput: AnswerChallengeInput,
  ) {
    if (!answerChallengeInput.challengeId) {
      throw new UserInputError('challengeId is required');
    }

    if (!answerChallengeInput.repositoryLink) {
      throw new UserInputError('repositoryLink is required');
    }

    if (
      !/^(https:\/\/github.com\/)/.test(answerChallengeInput.repositoryLink)
    ) {
      const createSubmissionInputError: Prisma.SubmissionCreateInput = {
        repositoryLink: answerChallengeInput.repositoryLink,
        grade: 0,
        status: 'Error',
        challenge: undefined,
      };
      await this.prisma.submission.create({
        data: createSubmissionInputError,
      });
      throw new Error('repositoryLink is not a github url');
    }

    const challenge = await this.prisma.challenge.findUnique({
      where: { id: answerChallengeInput.challengeId },
    });
    if (!challenge) {
      const createSubmissionInputError: Prisma.SubmissionCreateInput = {
        repositoryLink: answerChallengeInput.repositoryLink,
        grade: 0,
        status: 'Error',
        challenge: undefined,
      };
      await this.prisma.submission.create({
        data: createSubmissionInputError,
      });
      throw new Error('challengeId does not exist');
    }
  }
}
