import {NestFactory} from '@nestjs/core';
import {AppModule} from './app.module';
import {FastifyAdapter, NestFastifyApplication} from '@nestjs/platform-fastify';
import {DocumentBuilder, SwaggerModule} from '@nestjs/swagger';
import {EventGroup} from "./modules/base/enums/event.group";
import {WsAdapter} from '@nestjs/platform-ws'

async function bootstrap() {

  let eventGroup: EventGroup = process.env.APP_NAME as EventGroup;
  console.log('eventGroup', eventGroup);
  if (!eventGroup) {
    eventGroup = EventGroup.General;
  }

  const app = await NestFactory.create<NestFastifyApplication>(AppModule.register(eventGroup), new FastifyAdapter());

  app.useWebSocketAdapter(new WsAdapter(app));

  const options = new DocumentBuilder()
    .setTitle('Citrine')
    .setDescription('Citrine Core')
    .setVersion('{BUILD_VERSION}') // todo
    .build();
  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('api/swagger', app, document);

  await app.listen(3000);
}

bootstrap();
