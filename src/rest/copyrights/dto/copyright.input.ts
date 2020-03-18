import {
  IsNotEmpty, IsString, IsArray, IsDateString, ValidateNested
} from 'class-validator';
import { Type } from 'class-transformer';

import { ApiProperty } from '@nestjs/swagger';

class Author {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  contribution: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  authorship: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsDateString()
  dateOfBirth: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsDateString()
  dateOfDeath: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  nationality: string;
}

export class CopyrightInput {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  title: string;

  @ApiProperty()
  @IsArray()
  @IsNotEmpty({ each: true })
  @IsString({ each: true })
  altTitles: string[];

  @ApiProperty()
  @IsArray()
  @IsNotEmpty({ each: true })
  @IsString({ each: true })
  contributions: string[];

  @ApiProperty({ type: [Author] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => Author)
  authors: Author[];

  @ApiProperty()
  @IsNotEmpty()
  @IsDateString()
  creationDate: string;
  
  @ApiProperty()
  @IsNotEmpty()
  @IsDateString()
  publicationDate: string;
}