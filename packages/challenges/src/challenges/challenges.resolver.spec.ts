import { Test, TestingModule } from '@nestjs/testing';

import { PaginateService } from '../paginate.service';
import { PrismaService } from '../prisma.service';

import { ChallengesResolver } from './challenges.resolver';
import { ChallengesService } from './challenges.service';

describe('ChallengesResolver', () => {
  let resolver: ChallengesResolver;
  let prisma: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ChallengesResolver,
        ChallengesService,
        PrismaService,
        PaginateService,
      ],
    }).compile();

    resolver = module.get<ChallengesResolver>(ChallengesResolver);

    prisma = module.get<PrismaService>(PrismaService);
    await prisma.challenge.deleteMany({});
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });

  it('should create challenge successfully', async () => {
    const createdChallenge = await resolver.createChallenge({
      title: 'title test challenge',
      description: 'description test challenge',
    });

    expect(createdChallenge.id).toBeDefined();
  });

  it('should create challenge throw error title is required ', async () => {
    await expect(() => {
      return resolver.createChallenge({
        title: '',
        description: 'description test challenge',
      });
    }).rejects.toThrow('title is required');
  });

  it('should create challenge throw error description is required ', async () => {
    await expect(() => {
      return resolver.createChallenge({
        title: 'title test challenge',
        description: '',
      });
    }).rejects.toThrow('description is required');
  });

  it('should findAll challenges successfully', async () => {
    for (let i = 0; i < 10; i++) {
      await resolver.createChallenge({
        title: `title test challenge ${i + 1}`,
        description: `description test challenge ${i + 1}`,
      });
    }

    const challenges = await resolver.findAll();

    expect(challenges.length).toBe(10);
  });

  it('should findAll paginated challenges ', async () => {
    for (let i = 0; i < 15; i++) {
      await resolver.createChallenge({
        title: `title test challenge ${i + 1}`,
        description: `description test challenge ${i + 1}`,
      });
    }

    const challenges = await resolver.findAll({}, 2);

    expect(challenges.length).toBe(5);
  });

  it('should findAll filtered challenges', async () => {
    for (let i = 0; i < 10; i++) {
      await resolver.createChallenge({
        title: `title test challenge ${i + 1}`,
        description: `description test challenge ${i + 1}`,
      });
    }

    const challenges = await resolver.findAll({
      title: 'title test challenge 1',
    });

    expect(challenges.length).toBe(1);
  });

  it('should findOne challenge successfully', async () => {
    const createdChallenge = await resolver.createChallenge({
      title: `title test challenge 1`,
      description: `description test challenge 1`,
    });

    const findedChallenge = await resolver.findOne(createdChallenge.id);

    expect(findedChallenge.id).toBe(createdChallenge.id);
  });

  it('should findOne challenge throw challenge not found', async () => {
    await expect(() => {
      return resolver.findOne('f23019b2-d9e5-4160-b4b3-db9cdf131823');
    }).rejects.toThrow('challenge not found');
  });

  it('should update challenge successfully', async () => {
    const createdChallenge = await resolver.createChallenge({
      title: 'title test challenge',
      description: 'description test challenge',
    });

    const updatedChallenge = await resolver.updateChallenge(
      createdChallenge.id,
      {
        title: 'title test challenge updated',
      },
    );

    expect(updatedChallenge.title).toBe('title test challenge updated');
  });

  it('should update challenge throw challenge not found', async () => {
    await expect(() => {
      return resolver.updateChallenge('f23019b2-d9e5-4160-b4b3-db9cdf131823', {
        title: 'title test challenge updated',
      });
    }).rejects.toThrow('challenge not found');
  });

  it('should remove challenge successfully', async () => {
    const createdChallenge = await resolver.createChallenge({
      title: 'title test challenge',
      description: 'description test challenge',
    });
    let challenges = await resolver.findAll();
    expect(challenges.length).toBe(1);

    await resolver.removeChallenge(createdChallenge.id);
    challenges = await resolver.findAll();
    expect(challenges.length).toBe(0);
  });
});
