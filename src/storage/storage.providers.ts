import { ConfigService } from '@nestjs/config';
import { createClient } from '@supabase/supabase-js';
import { SUPABASE_CLIENT } from './storage.constants';

export const storageProviders = [
    {
        provide: SUPABASE_CLIENT,
        inject: [ConfigService],
        useFactory: (configService: ConfigService) => {
            return createClient(
                configService.getOrThrow<string>('SUPABASE_URL'),
                configService.getOrThrow<string>(
                    'SUPABASE_SECRET_KEY',
                ),
            );
        },
    },
];