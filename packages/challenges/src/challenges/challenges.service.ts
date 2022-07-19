import { Injectable } from '@nestjs/common';

import { PaginateService } from '../paginate.service';
import { PrismaService } from '../prisma.service';

import { CreateChallengeInput } from './dto/create-challenge.input';
import { UpdateChallengeInput } from './dto/update-challenge.input';
import { FindChallengeInput } from './dto/find-challenge.input';
import { UserInputError } from 'apollo-server-express';

@Injectable()
export class ChallengesService {
  constructor(
    private prisma: PrismaService,
    private paginateService: PaginateService,
  ) {}

  async create(createChallengeInput: CreateChallengeInput) {
    if (!createChallengeInput.title) {
      throw new UserInputError('title is required');
    }

    if (!createChallengeInput.description) {
      throw new UserInputError('description is required');
    }

    return this.prisma.challenge.create({
      data: createChallengeInput,
    });
  }

  async findAll(findChallengeInput?: FindChallengeInput, page?: number) {
    const pagination = this.paginateService.create(page);

    return this.prisma.challenge.findMany({
      where: findChallengeInput,
      ...pagination,
    });
  }

  async findOne(id: string) {
    const challenge = await this.prisma.challenge.findUnique({
      where: { id },
    });
    if (!challenge) {
      throw new UserInputError('challenge not found');
    }

    return this.prisma.challenge.findUnique({ where: { id } });
  }

  async update(id: string, updateChallengeInput: UpdateChallengeInput) {
    const challenge = await this.prisma.challenge.findUnique({
      where: { id },
    });
    if (!challenge) {
      throw new UserInputError('challenge not found');
    }

    return this.prisma.challenge.update({
      where: { id },
      data: updateChallengeInput,
    });
  }

  remove(id: string) {
    return this.prisma.challenge.delete({ where: { id } });
  }
}
