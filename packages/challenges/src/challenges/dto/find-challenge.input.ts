import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class FindChallengeInput {
  @Field({ nullable: true })
  title?: string;

  @Field({ nullable: true })
  description?: string;
}
