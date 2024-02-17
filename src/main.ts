import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as dotenv from 'dotenv';

dotenv.config();

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const swaggerOptions = new DocumentBuilder()
    .setTitle(process.env.API_DOCS_TITLE)
    .setDescription(process.env.API_DOCS_DESCRIPTION)
    .setVersion(process.env.API_DOCS_VERSION)
    .addTag(process.env.API_DOCS_TAG)
    .build();

  const document = SwaggerModule.createDocument(app, swaggerOptions);
  SwaggerModule.setup(process.env.API_DOCS_PATH, app, document);

  app.setGlobalPrefix(process.env.API_PREFIX);
  await app.listen(process.env.API_PORT);
}
bootstrap();
