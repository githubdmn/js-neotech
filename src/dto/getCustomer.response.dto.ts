import { ApiProperty } from "@nestjs/swagger";
import { IsInt, IsString } from "class-validator";

export default class GetCustomerResponseDto {
  @IsString()
  @ApiProperty()
  first_name: string;

  @IsString()
  @ApiProperty()
  last_name: string;

  @IsInt()
  @ApiProperty()
  balance: number;
}
