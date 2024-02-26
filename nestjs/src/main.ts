import {NestFactory} from '@nestjs/core';
import {AppModule} from './app.module';
import {FastifyAdapter, NestFastifyApplication} from '@nestjs/platform-fastify';
import {DocumentBuilder, SwaggerModule} from '@nestjs/swagger';
import {EventGroup} from "./modules/base/enums/event.group";
import {WsAdapter} from '@nestjs/platform-ws'
import {Logger} from "./modules/logger/logger";
import {Transport} from "@nestjs/microservices";

async function bootstrap() {

  let eventGroup: EventGroup = process.env.APP_NAME as EventGroup;
  console.log('eventGroup', eventGroup);
  if (!eventGroup) {
    eventGroup = EventGroup.General;
  }

  const app = await NestFactory.create<NestFastifyApplication>(AppModule.register(eventGroup), new FastifyAdapter());
  app.connectMicroservice({
    transport: Transport.RMQ,
    options: {
      urls: ['amqp://guest:guest@localhost:5672'],
      queue: 'cats_queue',
      queueOptions: {
        durable: false
      },
    },
  });
  await app.startAllMicroservices();
  app.useLogger(app.get(Logger));

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
