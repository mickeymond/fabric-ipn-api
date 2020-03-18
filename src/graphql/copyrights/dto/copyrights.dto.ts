import { ObjectType, Field } from 'type-graphql';

@ObjectType()
class AuthorType {
  @Field()
  readonly name: string;
  
  @Field()
  readonly contribution: string;

  @Field()
  readonly authorship: string;

  @Field()
  readonly dateOfBirth: string;

  @Field()
  readonly dateOfDeath: string;

  @Field()
  readonly nationality: string;
}

@ObjectType()
export class CopyrightType {
  @Field()
  readonly id: string;

  @Field()
  readonly title: string;

  @Field(() => [String])
  readonly altTitles: string[];

  @Field(() => [AuthorType])
  readonly authors: AuthorType[];

  @Field()
  readonly creationDate: string;

  @Field()
  readonly publicationDate: string;
}