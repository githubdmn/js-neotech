import { NestFactory } from "@nestjs/core";
import type { NestExpressApplication } from "@nestjs/platform-express";
import { AppModule } from "@/app.module";
import { ValidationPipe } from "@nestjs/common";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import { ProcessorModule } from "./api/processor/processor.module";
import { MicroserviceOptions, Transport } from "@nestjs/microservices";

async function bootstrap() {
  const microserviceOptions = {
    transport: Transport.TCP,
    options: {
      host: "localhost",
      port: 3001,
    },
  };
  const processorServiceApp = await NestFactory.createMicroservice(
    ProcessorModule,
    microserviceOptions
  );
  await processorServiceApp
    .listen()
    .then(() =>
      console.log("Processor Microservice is Listening on port 3001")
    );

  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  // await app.startAllMicroservices();
  // await app
  //   .connectMicroservice(processorServiceApp)
  //   .listen()
  //   .then(() => console.log("Processor Microservice is Listening on port 3001"))
  //   .catch(() => console.log("Failed to connect to processor microservice"));
  await app
    .useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
      })
    )
    // .enableVersioning({
    //   type: VersioningType.URI,
    //   defaultVersion: [],
    // })
    .setGlobalPrefix("api")

    .listen(3000)
    .then(() => console.log("Wallet API is Listening on port 3000"));

  const config = new DocumentBuilder()
    .setTitle("Neotech")
    .setDescription("Neotech task")
    .setVersion("1.0")
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup("api", app, document);
}
bootstrap();
