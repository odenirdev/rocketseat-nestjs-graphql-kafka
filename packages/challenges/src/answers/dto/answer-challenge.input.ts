import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class AnswerChallengeInput {
  @Field()
  challengeId: string;

  @Field()
  repositoryLink: string;
}
