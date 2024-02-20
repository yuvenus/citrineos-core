import {NestFactory} from '@nestjs/core';
import {AppModule} from './app.module';
import {FastifyAdapter, NestFastifyApplication} from '@nestjs/platform-fastify';
import {DocumentBuilder, SwaggerModule} from '@nestjs/swagger';
import {EventGroup} from "./modules/base/enums/event.group";

async function bootstrap() {

  const app = await NestFactory.create<NestFastifyApplication>(AppModule, new FastifyAdapter());

  let eventGroup: EventGroup = process.env.APP_NAME as EventGroup;
  if (!eventGroup) {
    eventGroup = EventGroup.General;
  }

  const options = new DocumentBuilder()
    .setTitle('Citrine')
    .setDescription('Citrine Core')
    .setVersion('{BUILD_VERSION}') // todo
    .build();
  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('api/swagger', app, document);


  const app = await NestFactory.create(AppModule.register(eventGroup));
  await app.listen(3000);
}

bootstrap();
