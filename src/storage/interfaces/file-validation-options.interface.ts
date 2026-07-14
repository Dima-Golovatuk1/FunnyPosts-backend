export interface FileValidationOptions {
    maxSize: number;
    mimeTypes: string[];
}

export interface FileFieldsValidationOptions {
    [field: string]: FileValidationOptions;
}