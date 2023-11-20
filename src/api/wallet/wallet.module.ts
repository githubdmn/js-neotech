import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { WalletApiController } from "@/api/wallet/wallet.controler";
import { WalletService } from "@/api/wallet/wallet.service";
import { Customer, CustomerSchema } from "@/models";
import { ProcessorModule } from "@/api/processor/processor.module";
import { ProcessorService } from "../processor/processor.service";

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Customer.name, schema: CustomerSchema },
    ]),
    ProcessorModule,
  ],
  controllers: [WalletApiController],
  providers: [WalletService, ProcessorService],
})
export class WalletApiModule {}
