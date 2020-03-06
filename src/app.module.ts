import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AppGraphQLModule } from './graphql/graphql.module';
import { AppRestModule } from './rest/rest.module';

@Module({
  imports: [
    AppGraphQLModule,
    AppRestModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
