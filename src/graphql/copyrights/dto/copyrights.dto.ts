import { ObjectType, Field } from 'type-graphql';

ObjectType()
export class CopyrightType {
  @Field()
  readonly id: string;

  @Field()
  readonly name: string;

  @Field()
  readonly owner: string;
}