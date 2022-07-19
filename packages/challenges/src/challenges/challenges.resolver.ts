import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';

import { ChallengesService } from './challenges.service';

import { Challenge } from './entities/challenge.entity';

import { CreateChallengeInput } from './dto/create-challenge.input';
import { UpdateChallengeInput } from './dto/update-challenge.input';
import { FindChallengeInput } from './dto/find-challenge.input';

@Resolver(() => Challenge)
export class ChallengesResolver {
  constructor(private readonly challengesService: ChallengesService) {}

  @Mutation(() => Challenge)
  createChallenge(
    @Args('createChallengeInput') createChallengeInput: CreateChallengeInput,
  ) {
    return this.challengesService.create(createChallengeInput);
  }

  @Query(() => [Challenge], { name: 'challenges' })
  findAll(
    @Args('findChallengeInput', { nullable: true })
    findChallengeInput?: FindChallengeInput,
    @Args('page', { nullable: true })
    page?: number,
  ) {
    return this.challengesService.findAll(findChallengeInput, page);
  }

  @Query(() => Challenge, { name: 'challenge' })
  findOne(@Args('id', { type: () => String }) id: string) {
    return this.challengesService.findOne(id);
  }

  @Mutation(() => Challenge)
  updateChallenge(
    @Args('id', { type: () => String }) id: string,
    @Args('updateChallengeInput') updateChallengeInput: UpdateChallengeInput,
  ) {
    return this.challengesService.update(id, updateChallengeInput);
  }

  @Mutation(() => Challenge)
  removeChallenge(@Args('id', { type: () => String }) id: string) {
    return this.challengesService.remove(id);
  }
}
