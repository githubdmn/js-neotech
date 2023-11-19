import { IsInt, IsNumber, IsString, Min } from "class-validator";

export default class TransactionDto {
  @IsNumber()
  @Min(1)
  value: number;

  @IsInt()
  @Min(1)
  latency: number;

  @IsString()
  customerId: string;
}
