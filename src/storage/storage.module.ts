import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { StorageService } from './storage.service';
import { storageProviders } from './storage.providers';

@Module({
    imports: [ConfigModule],
    providers: [
        ...storageProviders,
        StorageService,
    ],
    exports: [
        StorageService,
    ],
})
export class StorageModule {}