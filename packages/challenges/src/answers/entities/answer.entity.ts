import { ObjectType, Field, ID } from '@nestjs/graphql';

@ObjectType()
export class Answer {
  @Field(() => ID)
  id: string;

  @Field({ nullable: true })
  challengeId?: string;

  @Field(() => String)
  repositoryLink: string;

  @Field(() => String)
  status: string;

  @Field(() => Number)
  grade: number;

  @Field(() => Date)
  createdAt: Date;
}
