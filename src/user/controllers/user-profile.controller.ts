import {
    Body,
    Controller,
    Post,
    UploadedFile,
    UseInterceptors,
} from '@nestjs/common';
import { UserProfileService } from '../services/user-profile.service';
import { Authorization } from '@/auth/decorators/auth.decorator';
import { RenameDto } from '../dto/rename.dto';
import { Authorized } from '@/auth/decorators/authorized.decorator';
import { DescriptionDto } from '../dto/description.dto';
import { FileValidationPipe } from '@/storage/pipes/file-validation.pipe';
import {
    FileFieldsInterceptor,
    FileInterceptor,
} from '@nestjs/platform-express';
import { IMAGE_MIME_TYPES } from '@/storage/constants/mime-types';
import { ApiBody, ApiConsumes } from '@nestjs/swagger';

@Authorization()
@Controller('profile')
export class UserProfileController {
    constructor(private readonly userProfileService: UserProfileService) {}

    @Post('rename')
    async rename(@Body() dto: RenameDto, @Authorized('id') userId: string) {
        return await this.userProfileService.rename(userId, dto);
    }

    @Post('lastName')
    async lastName(@Authorized('id') userId: string, @Body() dto: RenameDto) {
        return await this.userProfileService.addLastName(userId, dto);
    }

    @Post('description')
    async description(
        @Body() dto: DescriptionDto,
        @Authorized('id') userId: string,
    ) {
        return await this.userProfileService.addDescription(userId, dto);
    }

    @ApiConsumes('multipart/form-data')
    @ApiBody({
        schema: {
            type: 'object',
            properties: {
                picture: {
                    type: 'string',
                    format: 'binary',
                },
            },
        },
    })
    @UseInterceptors(FileInterceptor('picture'))
    @Post('picture')
    async picture(
        @UploadedFile(
            new FileValidationPipe({
                picture: {
                    maxSize: 1 * 1024 * 1024,
                    mimeTypes: IMAGE_MIME_TYPES,
                },
            }),
        )
        picture: Express.Multer.File,
        @Authorized('id') userId: string,
    ) {
        return await this.userProfileService.addPicture(userId, picture);
    }

    @Post('twoFactor')
    async twoFactor(@Authorized('id') userId: string) {
        return await this.userProfileService.twoFactor(userId);
    }
}
