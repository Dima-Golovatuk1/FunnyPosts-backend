import { ConfigService } from '@nestjs/config';
import { RedisStore } from 'connect-redis';
import { RedisClientType } from 'redis';

import { ms, StringValue } from '@/libs/common/utils/ms.util';
import { parserBoolean } from '@/libs/common/utils/parse-boolean.util';

const session = require('express-session');

export function createSessionMiddleware(
    config: ConfigService,
    redisClient: RedisClientType,
) {
    return session({
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
            secure: parserBoolean(config.getOrThrow<string>('SESSION_SECURE')),
            sameSite: 'lax',
        },
        store: new RedisStore({
            client: redisClient,
            prefix: config.getOrThrow<string>('SESSION_FOLDER'),
        }),
    });
}
