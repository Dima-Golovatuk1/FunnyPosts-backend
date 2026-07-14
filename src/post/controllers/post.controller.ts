import {
    Body,
    Controller,
    FileTypeValidator,
    FileValidator,
    Get,
    MaxFileSizeValidator,
    Param,
    ParseFilePipe,
    Post,
    Query,
    UploadedFile,
    UploadedFiles,
    UseInterceptors,
} from '@nestjs/common';
import { PostService } from '../services/post.service';
import { GetPostsDto } from '../dto/getPosts.dto';
import {
    FileFieldsInterceptor,
    FileInterceptor,
} from '@nestjs/platform-express';
import { ApiBody, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { FileValidationPipe } from '@/storage/pipes/file-validation.pipe';
import {
    IMAGE_AND_VIDEO_MIME_TYPES,
    IMAGE_MIME_TYPES,
} from '@/storage/constants/mime-types';
import { CreatePostDto } from '../dto/create-post.dto';
import { Authorization } from '@/auth/decorators/auth.decorator';
import { Authorized } from '@/auth/decorators/authorized.decorator';

@ApiTags('Posts')
@Controller('posts')
export class PostController {
    constructor(private readonly postService: PostService) {}

    @Get('')
    async getAll(@Query() dto: GetPostsDto) {
        return await this.postService.getAll(dto);
    }

    // ------GET ONE POST--------
    @Get(':id')
    async getOne(@Param('id') id: string) {
        return await this.postService.getOneById(id);
    }

    // ------CREATE POST--------
    @Authorization()
    @ApiConsumes('multipart/form-data')
    @ApiBody({
        schema: {
            type: 'object',
            properties: {
                title: {
                    type: 'string',
                },

                description: {
                    type: 'string',
                },

                cover: {
                    type: 'string',
                    format: 'binary',
                },

                media: {
                    type: 'array',
                    items: {
                        type: 'string',
                        format: 'binary',
                    },
                },
            },
        },
    })
    @Post('create')
    @UseInterceptors(
        FileFieldsInterceptor([
            {
                name: 'cover',
                maxCount: 1,
            },
            {
                name: 'media',
                maxCount: 10,
            },
        ]),
    )
    async create(
        @UploadedFiles(
            new FileValidationPipe({
                cover: {
                    maxSize: 5 * 1024 * 1024,
                    mimeTypes: IMAGE_MIME_TYPES,
                },

                media: {
                    maxSize: 10 * 1024 * 1024,
                    mimeTypes: IMAGE_AND_VIDEO_MIME_TYPES,
                },
            }),
        )
        files: {
            cover?: Express.Multer.File[];
            media?: Express.Multer.File[];
        },
        @Authorized('id') userId: string,

        @Body() dto: CreatePostDto,
    ) {
        return await this.postService.create(dto, userId, files);
    }
}
