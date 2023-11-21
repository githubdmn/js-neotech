import { Module } from "@nestjs/common";
import { WalletApiModule } from "@/api/wallet/wallet.module";

@Module({
  imports: [WalletApiModule],
})
export class AppModule {}
