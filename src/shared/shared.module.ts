import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';

import { CopyrightsService } from './services/copyrights.service';
import { UsersService } from './services/users.service';

@Module({
  imports: [
    // ConfigModule.forRoot()
  ],
  providers: [
    ConfigService,
    UsersService,
    CopyrightsService
  ],
  exports: [
    ConfigService,
    UsersService,
    CopyrightsService
  ]
})
export class SharedModule {}
