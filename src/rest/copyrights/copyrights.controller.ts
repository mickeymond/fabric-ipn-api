import { Controller, Get, Post, Body, InternalServerErrorException } from '@nestjs/common';
import { CopyrightsService } from '../../shared/services/copyrights.service';

@Controller('copyrights')
export class CopyrightsController {
  constructor(
    private readonly copyrightsService: CopyrightsService
  ) {}

  @Get()
  copyrights() {
    try {
      return this.copyrightsService.readCopyrights();
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  @Post()
  createCopyright(@Body() data) {
    try {
      return this.copyrightsService.createCopyright('admin', data);
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }
}
