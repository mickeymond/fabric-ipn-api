import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseGuards,
  Req,
} from '@nestjs/common';
import { ApiBody, ApiTags, ApiParam } from '@nestjs/swagger';

import { CopyrightsService } from '../../shared/services/copyrights.service';
import { CopyrightInput } from './dto/copyright.input';
import { AuthGuard } from '../../shared/guards/auth.guard';
import { IUserType } from '../../shared/interfaces/user.interface';

@Controller('copyrights')
@ApiTags('Copyrights')
@UseGuards(AuthGuard)
export class CopyrightsController {
  constructor(
    private readonly copyrightsService: CopyrightsService
  ) {}

  @Post()
  @ApiBody({
    type: CopyrightInput,
    description: "Data to create a New Copyright on the Blockchain"
  })
  addCopyright(
    @Req() req: { user: IUserType },
    @Body() copyrightInput: CopyrightInput
  ) {
    return this.copyrightsService.createCopyright(req.user, copyrightInput);
  }

  @Get()
  async findAllCopyrights(
    @Req() req: { user: IUserType },
  ) {
    const copyrights = await this.copyrightsService.readCopyrights(req.user);

    return {
      success: true,
      count: copyrights.length,
      data: copyrights
    };
  }

  @Get(':id')
  @ApiParam({ name: 'id', description: 'The Unique ID of your copyright' })
  async findCopyrightById(
    @Req() req: { user: IUserType },
    @Param('id') id: string
  ) {
    const copyright = await this.copyrightsService.readCopyright(req.user, id);

    return {
      success: true,
      data: copyright
    };
  }
}
