import { InputType, Field } from '@nestjs/graphql';

@InputType()
class QueryAnswersInputTypeDate {
  @Field({ nullable: true })
  gte: Date;

  @Field({ nullable: true })
  lte: Date;
}

@InputType()
export class QueryAnswersInput {
  @Field({ nullable: true })
  challengeId?: string;

  @Field({ nullable: true })
  status?: string;

  @Field(() => QueryAnswersInputTypeDate, { nullable: true })
  createdAt?: QueryAnswersInputTypeDate;
}
