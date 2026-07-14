import { PrismaService } from '@/prisma/prisma.service';
import {
    BadRequestException,
    Injectable,
    NotFoundException,
} from '@nestjs/common';
import { RenameDto } from '../dto/rename.dto';
import { DescriptionDto } from '../dto/description.dto';
import { StorageService } from '@/storage/storage.service';
import { UserService } from './user.service';

@Injectable()
export class UserProfileService {
    public constructor(
        public readonly prismaService: PrismaService,
        public readonly storageService: StorageService,
        public readonly userService: UserService,
    ) {}

    public async rename(userId: string, dto: RenameDto) {
        const { name } = dto;

        return await this.prismaService.user.update({
            data: {
                name,
            },
            where: {
                id: userId,
            },
        });
    }

    public async addLastName(userId: string, dto: RenameDto) {
        return await this.prismaService.user.update({
            data: {
                lastName: dto.name,
            },
            where: {
                id: userId,
            },
        });
    }

    public async addDescription(userId: string, dto: DescriptionDto) {
        const { description } = dto;

        return await this.prismaService.user.update({
            data: {
                description,
            },
            where: {
                id: userId,
            },
        });
    }

    public async addPicture(userId: string, file: Express.Multer.File) {
        if (!file) {
            throw new BadRequestException('Picture is required');
        }

        const user = await this.userService.findById(userId);

        if (
            user.picture &&
            (await this.storageService.isStorageFile(user.picture))
        ) {
            const path = await this.storageService.extractPath(user.picture);

            await this.storageService.deleteFile('user-picture', path);
        }

        const path = await this.storageService.uploadFile('user-picture', file);

        const pictureUrl = await this.storageService.getPublicUrl(
            'user-picture',
            path,
        );

        return await this.prismaService.user.update({
            data: {
                picture: pictureUrl,
            },
            where: {
                id: userId,
            },
        });
    }

    public async twoFactor(userId: string) {
        const user = await this.userService.findById(userId);

        if (user.isTwoFactorEnabled === true) {
            return await this.prismaService.user.update({
                data: {
                    isTwoFactorEnabled: false,
                },
                where: {
                    id: userId,
                },
            });
        } else {
            return await this.prismaService.user.update({
                data: {
                    isTwoFactorEnabled: true,
                },
                where: {
                    id: userId,
                },
            });
        }
    }
}
