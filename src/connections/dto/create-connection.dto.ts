import { ApiProperty } from '@nestjs/swagger';
import { IsMongoId, IsString } from 'class-validator';

export class CreateConnectionDto {
  @ApiProperty({
    example: '60c72b2f9b1e8d001c8b2f10',
    description: 'ID of the user to be connected',
  })
  @IsString()
  @IsMongoId()
  connectedUser: string;
}
