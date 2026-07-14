import { PrismaService } from '@/prisma/prisma.service';
import { Injectable, NotFoundException } from '@nestjs/common';
import { LikeType } from '@prisma/client';

@Injectable()
export class LikeServise {
    public constructor(public readonly prismaService: PrismaService) {}

    public async addOrRemoveLike(id: string, userId: string, type: LikeType) {
        if(type === LikeType.POST){
            const post = await this.prismaService.post.findUnique({
                where:{
                    id
                }
            })

            if(!post){
                throw new NotFoundException('Post not found')
            }
        } else {
            const comment = await this.prismaService.comment.findUnique({
                where: {
                    id
                }
            })

            if(!comment){
                throw new NotFoundException("comment not found")
            }
        }

        const where =
            type === LikeType.POST
                ? { userId, postId: id }
                : { userId, commentId: id };

        const data =
            type === LikeType.POST
                ? { userId, postId: id, type }
                : { userId, commentId: id, type };
        
        const like = await this.prismaService.like.findFirst({
            where,
        });

        if (like) {
            await this.prismaService.like.delete({
                where: {
                    id: like.id,
                },
            });

            return {
                liked: false,
            };
        }

        await this.prismaService.like.create({
            data,
        });

        return {
            liked: true,
        };
    }

    public async getNumLikes(postId: string){
        return (await this.prismaService.like.findMany({
            where: {
                postId
            }
        })).length
    }
}
