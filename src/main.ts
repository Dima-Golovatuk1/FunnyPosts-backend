import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

import { createClient } from 'redis';
import * as cookieParser from 'cookie-parser';

import { AppModule } from './app.module';

import { createSessionMiddleware } from './config/session.config';
import { SessionIoAdapter } from './websocket/session.adapter';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);

    const sessionConfig = require('express-session');
    const config = app.get(ConfigService);
    const redisClient = createClient({
        url: config.getOrThrow('REDIS_URI'),
    });

    await redisClient.connect();

    const swaggerConfig = new DocumentBuilder()
        .setTitle('FunnyPost example')
        .setDescription('The posts API description')
        .setVersion('1.0')
        .build();

    app.use((cookieParser as any)(config.getOrThrow<string>('COOKIE_SECRET')));

    app.useGlobalPipes(
        new ValidationPipe({
            transform: true,
        }),
    );

    const documentFactory = () =>
        SwaggerModule.createDocument(app, swaggerConfig);
    SwaggerModule.setup('api', app, documentFactory);

    const sessionMiddleware = createSessionMiddleware(
        config,
        redisClient
    )

    app.useWebSocketAdapter( new SessionIoAdapter(app, sessionMiddleware))
    app.use(sessionMiddleware);
    app.enableCors({
        origin: config.getOrThrow<string>('ALLOWED_ORIGIN'),
        credential: true,
        exposedHeaders: ['set-cookie'],
    });

    await app.listen(config.getOrThrow<number>('APPLICATION_PORT'));
}
bootstrap();
