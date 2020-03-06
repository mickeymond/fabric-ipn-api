import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { CopyrightsResolver } from './copyrights/copyrights.resolver';
import { SharedModule } from '../shared/shared.module';

@Module({
  imports: [
    SharedModule,
    GraphQLModule.forRoot({
      autoSchemaFile: 'src/graphql/schema.gql',
      definitions: {
        path: 'src/graphql/graphql.ts',
      },
    }),
  ],
  controllers: [],
  providers: [CopyrightsResolver],
})
export class AppGraphQLModule {}
