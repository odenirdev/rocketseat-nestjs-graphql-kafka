import { Test, TestingModule } from '@nestjs/testing';

import { PaginateService } from '../paginate.service';
import { PrismaService } from '../prisma.service';

import { AnswersResolver } from './answers.resolver';
import { AnswersService } from './answers.service';

describe('AnswersResolver', () => {
  let resolver: AnswersResolver;
  let prisma: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AnswersResolver,
        AnswersService,
        PrismaService,
        PaginateService,
      ],
    }).compile();

    resolver = module.get<AnswersResolver>(AnswersResolver);

    prisma = module.get<PrismaService>(PrismaService);

    await prisma.challenge.deleteMany({});
    await prisma.submission.deleteMany({});
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });

  it('should answer submission be done', async () => {
    const createdChallenge = await prisma.challenge.create({
      data: {
        title: 'title test challenge',
        description: 'description test challenge',
      },
    });

    const submissionAnswer = await resolver.answerChallenge({
      challengeId: createdChallenge.id,
      repositoryLink: 'https://github.com/Rocketseat/app-quiz',
    });

    expect(submissionAnswer.status).toBe('Done');
  });

  it('should answer submission throw repositoryLink is required', async () => {
    expect(() =>
      resolver.answerChallenge({
        challengeId: 'f23019b2-d9e5-4160-b4b3-db9cdf131823',
        repositoryLink: '',
      }),
    ).rejects.toThrow('repositoryLink is required');
  });

  it('should answer submission throw challengeId is required', async () => {
    expect(() =>
      resolver.answerChallenge({
        challengeId: '',
        repositoryLink: 'https://github.com/Rocketseat/app-quiz',
      }),
    ).rejects.toThrow('challengeId is required');
  });

  it('should findAll challenges successfully', async () => {
    const createdChallenge = await prisma.challenge.create({
      data: {
        title: 'title test challenge',
        description: 'description test challenge',
      },
    });

    for (let i = 0; i < 10; i++) {
      await prisma.submission.create({
        data: {
          challengeId: createdChallenge.id,
          repositoryLink: 'https://github.com/Rocketseat/app-quiz',
          grade: i + 1,
          status: 'Done',
        },
      });
    }

    const submissions = await resolver.findAll();

    expect(submissions.length).toBe(10);
  });

  it('should findAll paginated challenges ', async () => {
    const createdChallenge = await prisma.challenge.create({
      data: {
        title: 'title test challenge',
        description: 'description test challenge',
      },
    });

    for (let i = 0; i < 15; i++) {
      await prisma.submission.create({
        data: {
          challengeId: createdChallenge.id,
          repositoryLink: 'https://github.com/Rocketseat/app-quiz',
          grade: i + 1,
          status: 'Done',
        },
      });
    }

    const challenges = await resolver.findAll({}, 2);

    expect(challenges.length).toBe(5);
  });

  it('should findAll filtered challenges', async () => {
    const createdChallenge = await prisma.challenge.create({
      data: {
        title: 'title test challenge',
        description: 'description test challenge',
      },
    });

    for (let i = 0; i < 5; i++) {
      await prisma.submission.create({
        data: {
          challengeId: createdChallenge.id,
          repositoryLink: `https://github.com/Rocketseat/app-quiz-${i + 1}`,
          grade: i + 1,
          status: 'Pending',
        },
      });
    }

    for (let i = 0; i < 5; i++) {
      await prisma.submission.create({
        data: {
          challengeId: createdChallenge.id,
          repositoryLink: `https://github.com/Rocketseat/app-quiz-${i + 1}`,
          grade: i + 1,
          status: 'Done',
        },
      });
    }

    const challenges = await resolver.findAll();
    expect(challenges.length).toBe(10);

    const challengesFiltered = await resolver.findAll({ status: 'Done' });
    expect(challengesFiltered.length).toBe(5);
  });
});
