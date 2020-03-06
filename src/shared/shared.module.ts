import { Module } from '@nestjs/common';
import { CopyrightsService } from './services/copyrights.service';

@Module({
  imports: [],
  providers: [
    CopyrightsService
  ],
  exports: [
    CopyrightsService
  ]
})
export class SharedModule {}
