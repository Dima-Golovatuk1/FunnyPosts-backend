import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

import { createClient } from 'redis';
import * as cookieParser from 'cookie-parser';
import * as session from 'express-session';

import { RedisStore } from 'connect-redis';
import { AppModule } from './app.module';

import { ms, StringValue } from './libs/common/utils/ms.util';
import { parserBoolean } from './libs/common/utils/parse-boolean.util';

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

    app.use(
        sessionConfig({
            secret: config.getOrThrow<string>('SESSION_SECRET'),
            name: config.getOrThrow<string>('SESSION_NAME'),
            resave: true,
            saveUninitialized: false,
            cookie: {
                domain: config.getOrThrow<string>('SESSION_DOMAIN'),
                maxAge: ms(config.getOrThrow<StringValue>('SESSION_MAX_AGE')),
                httpOnly: parserBoolean(
                    config.getOrThrow<string>('SESSION_HTTP_ONLY'),
                ),
                secure: parserBoolean(
                    config.getOrThrow<string>('SESSION_SECURE'),
                ),
                sameSite: 'lax',
            },
            store: new RedisStore({
                client: redisClient,
                prefix: config.getOrThrow<string>('SESSION_FOLDER'),
            }),
        }),
    );
    app.enableCors({
        origin: config.getOrThrow<string>('ALLOWED_ORIGIN'),
        credential: true,
        exposedHeaders: ['set-cookie'],
    });

    await app.listen(config.getOrThrow<number>('APPLICATION_PORT'));
}
bootstrap();
