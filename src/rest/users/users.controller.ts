import { Controller, Post, Body, Delete, UseGuards, Req } from '@nestjs/common';
import { ApiTags, ApiBody } from '@nestjs/swagger';

import { UsersService } from '../../shared/services/users.service';
import { UserInput, UserRevokeInput } from './dto/user.input';
import { AuthGuard } from '../../shared/guards/auth.guard';
import { IUserType } from '../../shared/interfaces/user.interface';

@Controller('users')
@ApiTags('Users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService
  ) {}

  @Post('register')
  @ApiBody({
    type: UserInput,
    description: 'Data to Register a New User on Blockchain'
  })
  register(@Body() userInput: UserInput) {
    return this.usersService.register(userInput);
  }

  @Post('enroll')
  @ApiBody({
    type: UserInput,
    description: 'Data to Enroll User on Blockchain'
  })
  async enroll(@Body() userInput: UserInput) {
    const token = await this.usersService.enroll(userInput);
    return {
      success: true,
      token
    };
  }

  @Delete('revoke')
  @ApiBody({
    type: UserRevokeInput,
    description: 'Data to Revoke User on Blockchain'
  })
  @UseGuards(AuthGuard)
  revoke(
    @Req() req: { user: IUserType },
    @Body() { enrollmentId }: UserRevokeInput
  ) {
    return this.usersService.revoke(req.user, enrollmentId);
  }
}
