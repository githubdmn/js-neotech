import { Module } from "@nestjs/common";
import { ProcessorService } from "./processor.service";
import { Customer, CustomerSchema } from "@/models";
import { MongooseModule } from "@nestjs/mongoose";

const Services = [
  {
    provide: "PROCESSOR",
    useClass: ProcessorService,
  },
];

@Module({
  controllers: [],
  providers: [...Services],
  imports: [
    MongooseModule.forRoot(
      "mongodb+srv://public:public@cluster0.acf3fvs.mongodb.net/?retryWrites=true&w=majority"
    ),
    MongooseModule.forFeature([
      { name: Customer.name, schema: CustomerSchema },
    ]),
  ],
  exports: [...Services],
})
export class ProcessorModule {}
