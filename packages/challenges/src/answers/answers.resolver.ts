import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';

import { AnswersService } from './answers.service';

import { Answer } from './entities/answer.entity';

import { AnswerChallengeInput } from './dto/answer-challenge.input';
import { QueryAnswersInput } from './dto/query-answers.input';

@Resolver(() => Answer)
export class AnswersResolver {
  constructor(private readonly answersService: AnswersService) {}

  @Mutation(() => Answer)
  answerChallenge(
    @Args('createAnswerInput') answerChallengeInput: AnswerChallengeInput,
  ) {
    return this.answersService.create(answerChallengeInput);
  }

  @Query(() => [Answer], { name: 'answers' })
  findAll(
    @Args('queryAnswersInput', { nullable: true })
    queryAnswersInput?: QueryAnswersInput,
    @Args('page', { nullable: true })
    page?: number,
  ) {
    return this.answersService.findAll(queryAnswersInput, page);
  }
}
