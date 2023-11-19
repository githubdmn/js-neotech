import { NestFactory } from "@nestjs/core";
import type { NestExpressApplication } from "@nestjs/platform-express";
import { AppModule } from "@/app.module";
import { ValidationPipe } from "@nestjs/common";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app
    .useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
      })
    )
    // .enableVersioning({
    //   type: VersioningType.URI,
    //   defaultVersion: [],
    // })
    .setGlobalPrefix("api");

  const config = new DocumentBuilder()
    .setTitle("Neotech")
    .setDescription("TASK")
    .setVersion("1.0")
    .addTag("nestjs")
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup("api", app, document);

  await app.listen(process.env.PORT || 3000);
}
bootstrap();
