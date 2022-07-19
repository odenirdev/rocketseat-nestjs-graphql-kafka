import { ObjectType, Field, ID } from '@nestjs/graphql';

@ObjectType()
export class Challenge {
  @Field(() => ID)
  id: number;

  @Field()
  title: string;

  @Field()
  description: string;

  @Field()
  createdAt: Date;
}
