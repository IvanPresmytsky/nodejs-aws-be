import { NestFactory } from '@nestjs/core';
import { Logger } from '@nestjs/common';
import { AppModule } from './app.module';

async function bootstrap() {
  const logger = new Logger('bootstrap');
  const PORT = process.env.PORT || 3000;
 
  const app = await NestFactory.create(AppModule);

  app.enableCors();

  await app.listen(PORT);
  logger.log(`The app is listening on port ${PORT}`);
}

bootstrap();
