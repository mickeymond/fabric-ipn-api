import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AppGraphQLModule } from './graphql/graphql.module';
import { AppRestModule } from './rest/rest.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    AppGraphQLModule,
    AppRestModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
