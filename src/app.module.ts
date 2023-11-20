import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { WalletApiModule } from "@/api/wallet/wallet.module";

@Module({
  imports: [
    MongooseModule.forRoot(
      "mongodb+srv://public:public@cluster0.acf3fvs.mongodb.net/?retryWrites=true&w=majority"
    ),
    WalletApiModule,
  ],
})
export class AppModule {}
