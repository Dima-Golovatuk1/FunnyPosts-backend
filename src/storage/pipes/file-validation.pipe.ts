import {
    ArgumentMetadata,
    BadRequestException,
    Injectable,
    PipeTransform,
} from '@nestjs/common';
import { FileFieldsValidationOptions } from '../interfaces/file-validation-options.interface';

@Injectable()
export class FileValidationPipe implements PipeTransform {
    constructor(private readonly options: FileFieldsValidationOptions) {}

    transform(
        value: Record<string, Express.Multer.File[]>,
        metadata: ArgumentMetadata,
    ) {
        if (!value) {
            return value;
        }

        for (const fieldName of Object.keys(this.options)) {
            const rules = this.options[fieldName];

            const files = value[fieldName];

            if (!files) {
                continue;
            }

            for (const file of files) {
                this.validateSize(
                    file,
                    rules.maxSize,
                    fieldName
                );

                this.validateMimeType(
                    file,
                    rules.mimeTypes,
                    fieldName,
                )
            }
        }

        return value;
    }

    private validateSize(
        file: Express.Multer.File,
        maxSize: number,
        fieldName: string,
    ) {
        if (file.size > maxSize) {
            throw new BadRequestException(
                `${fieldName}: maximum file size is ${this.formatBytes(maxSize)}.`,
            );
        }
    }

    private validateMimeType(
        file: Express.Multer.File,
        allowedMimeTypes: string[],
        fieldName: string,
    ) {
        if (!allowedMimeTypes.includes(file.mimetype)) {
            throw new BadRequestException(
                `${fieldName}: unsupported file type "${file.mimetype}".`,
            );
        }
    }

    private formatBytes(bytes: number): string {
        const mb = bytes / (1024 * 1024);

        if (mb >= 1) {
            return `${mb.toFixed(1)} MB`;
        }

        return `${(bytes / 1024).toFixed(0)} KB`;
    }
}
