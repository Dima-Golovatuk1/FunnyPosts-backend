import {
    BadRequestException,
    Inject,
    Injectable,
    OnModuleInit,
} from '@nestjs/common';
import { SUPABASE_CLIENT } from './storage.constants';
import { SupabaseClient } from '@supabase/supabase-js';
import { randomUUID } from 'crypto';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class StorageService {
    constructor(
        @Inject(SUPABASE_CLIENT)
        private readonly supabaseClient: SupabaseClient,
        private readonly configService: ConfigService
    ) {}

    public async uploadFile(
        bucket: string,
        file: Express.Multer.File,
    ): Promise<string> {
        const extension = file.originalname.split('.').pop();
        const fileName = `${randomUUID()}.${extension}`;

        const { error } = await this.supabaseClient.storage
            .from(bucket)
            .upload(fileName, file.buffer, {
                contentType: file.mimetype,
                upsert: false,
            });

        if (error) {
            throw new BadRequestException(error.message);
        }

        return fileName;
    }

    public async uploadFiles(
        bucket: string,
        files: Express.Multer.File[],
    ): Promise<string[]> {
        return Promise.all(files.map((file) => this.uploadFile(bucket, file)));
    }

    public getPublicUrl(bucket: string, path: string): string {
        const { data } = this.supabaseClient.storage
            .from(bucket)
            .getPublicUrl(path);

        return data.publicUrl;
    }

    public async deleteFile(bucket: string, path: string): Promise<void> {
        const { error } = await this.supabaseClient.storage
            .from(bucket)
            .remove([path]);

        if (error) {
            throw new BadRequestException(error.message);
        }
    }

    public async deleteFiles(bucket: string, paths: string[]): Promise<void> {
        const { error } = await this.supabaseClient.storage
            .from(bucket)
            .remove(paths);

        if (error) {
            throw new BadRequestException(error.message);
        }
    }

    public async extractPath(url: string): Promise<string>{
        return url.split('/').pop()!;
    }

    public async isStorageFile(url: string): Promise<boolean> {
        return url.startsWith(this.configService.getOrThrow('SUPABASE_URL'));
    }
}
