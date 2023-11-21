import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { WalletApiController } from "@/api/wallet/wallet.controler";
import { WalletService } from "@/api/wallet/wallet.service";
import { Customer, CustomerSchema } from "@/models";
import { ClientsModule, Transport } from "@nestjs/microservices";

@Module({
  imports: [
    MongooseModule.forRoot(
      "mongodb+srv://public:public@cluster0.acf3fvs.mongodb.net/?retryWrites=true&w=majority"
    ),
    MongooseModule.forFeature([
      { name: Customer.name, schema: CustomerSchema },
    ]),
    ClientsModule.register([
      {
        name: "PROCESSOR_SERVICE",
        transport: Transport.TCP,
        options: {
          host: "localhost",
          port: 3001,
        },
      },
    ]),
  ],
  controllers: [WalletApiController],
  providers: [WalletService],
})
export class WalletApiModule {}
