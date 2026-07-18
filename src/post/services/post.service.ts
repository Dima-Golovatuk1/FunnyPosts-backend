import { Injectable, NotFoundException } from '@nestjs/common';
import { GetPostsDto } from '../dto/getPosts.dto';
import { PrismaService } from '@/prisma/prisma.service';
import { CreatePostDto } from '../dto/create-post.dto';
import { StorageService } from '@/storage/storage.service';
import { MediaType } from '@prisma/client';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class PostService {
    public constructor(
        private readonly prismaService: PrismaService,
        private readonly storageService: StorageService,
        private readonly configService: ConfigService
    ) {}

    public async getAll(dto: GetPostsDto) {
        const { cursor, limit } = dto;

        const posts = await this.prismaService.post.findMany({
            take: limit,
            ...(cursor && {
                cursor: {
                    id: cursor,
                },
                skip: 1,
            }),
            orderBy: [{ createdAt: 'desc' }, { id: 'desc' }],
            include: {
                author: {
                    select: {
                        id: true,
                        name: true,
                        picture: true
                    }
                }
            }
        });

        return {
            items: posts,
            nextCursor:
                posts.length === limit ? posts[posts.length - 1].id : null,
        };
    }

    public async create(
        dto: CreatePostDto,
        userId: string,
        files: { cover?: Express.Multer.File[]; media?: Express.Multer.File[] },
    ) {
        const { title, description } = dto;

        let uploadedCoverUrl: string | undefined;

        const mediaToCreate: Array<{ path: string; type: MediaType }> = [];

        // ---------- Cover ----------
        if (files.cover?.length) {
            const path = await this.storageService.uploadFile(
                'posts-media',
                files.cover[0],
            );

            uploadedCoverUrl = this.storageService.getPublicUrl(
                'posts-media',
                path,
            );
        }

        // ---------- Media ----------
        if (files.media?.length) {
            for (const file of files.media) {
                const path = await this.storageService.uploadFile(
                    'posts-media',
                    file,
                );

                mediaToCreate.push({
                    path,
                    type: file.mimetype.startsWith('video/')
                        ? MediaType.VIDEO
                        : MediaType.IMAGE,
                });
            }
        }

        return await this.prismaService.post.create({
            data: {
                title,
                description,
                authorId: userId,
                coverUrl: uploadedCoverUrl,

                media: {
                    create: mediaToCreate,
                },
            },
            include: {
                media: true,
                author: true,
            },
        });
    }

    public async getOneById(id: string) {
        const post = await this.prismaService.post.findFirst({
            where: {
                id,
            },
            include: {
                author: {
                    select: {
                        id: true,
                        name: true,
                        picture: true
                    }
                },
                media: true,
                comments: true
            },
        });

        if (!post) {
            throw new NotFoundException('Post not found');
        }

        return {
            ...post,
            media: post.media.map((m) => ({
                ...m,
                url: this.storageService.getPublicUrl('posts-media', m.path),
            })),
        };
    }

    public async deleteById(userId: string, postId: string){
        const post = await this.prismaService.post.findFirst({
            where: {
                id: postId,
                authorId: userId
            }
        })

        if(!post){
            throw new NotFoundException("Post not found")
        }

        return await this.prismaService.post.delete({
            where: {
                id: postId,
                authorId: userId
            }
        })
    }
}
