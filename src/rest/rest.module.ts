import { Module } from '@nestjs/common';
import { SharedModule } from '../shared/shared.module';
import { CopyrightsController } from './copyrights/copyrights.controller';

@Module({
  imports: [
    SharedModule
  ],
  controllers: [CopyrightsController],
  providers: [],
})
export class AppRestModule {}
