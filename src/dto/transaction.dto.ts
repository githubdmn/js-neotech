import { ApiProperty } from "@nestjs/swagger";
import { IsInt, IsNumber, IsString, Min } from "class-validator";

export default class TransactionDto {
  @IsNumber()
  @Min(1)
  @ApiProperty()
  value: number;

  @IsInt()
  @Min(1)
  @ApiProperty()
  latency: number;

  @IsString()
  @ApiProperty()
  customerId: string;
}
