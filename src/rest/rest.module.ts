import { Module } from '@nestjs/common';
import { SharedModule } from '../shared/shared.module';
import { CopyrightsController } from './copyrights/copyrights.controller';
import { UsersController } from './users/users.controller';

@Module({
  imports: [
    SharedModule
  ],
  controllers: [CopyrightsController, UsersController],
  providers: [],
})
export class AppRestModule {}
