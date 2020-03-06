import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { GraphQLModule } from './graphql/graphql.module';
import { RestModule } from './rest/rest.module';

@Module({
  imports: [
    GraphQLModule,
    RestModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
