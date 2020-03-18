import {
  IsNotEmpty, IsString
} from 'class-validator';

import { ApiProperty } from '@nestjs/swagger';

export class UserInput {
  @ApiProperty({ description: 'You can use the username for a user of your service' })
  @IsNotEmpty()
  @IsString()
  enrollmentId: string;

  @ApiProperty({ description: 'You can use the password for a user of your service' })
  @IsNotEmpty()
  @IsString()
  enrollmentSecret: string;
}

export class UserRevokeInput {
  @ApiProperty({ description: 'You can use the username for a user of your service' })
  @IsNotEmpty()
  @IsString()
  enrollmentId: string;
}