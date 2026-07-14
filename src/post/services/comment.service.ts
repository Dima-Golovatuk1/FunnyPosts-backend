import { PrismaService } from "@/prisma/prisma.service";
import { Injectable, NotFoundException } from "@nestjs/common";
import { PostService } from "./post.service";
import { CreateCommentDto } from "../dto/create-comment";

@Injectable()
export class CommentService{
    public constructor(
        public readonly prismaService: PrismaService,
        public readonly postService: PostService
    ){}

    async add( dto: CreateCommentDto, postId: string, userId: string ){
        const post = await this.postService.getOneById(postId)

        if(!post){
            throw new NotFoundException('Post not found')
        }

        const { text } = dto

        return await this.prismaService.comment.create({
            data: {
                text,
                userId,
                postId,
            }
        })
    }

    async showByPost(postId: string){
        return await this.prismaService.comment.findMany({
            where: {
                postId
            }
        })
    }

    async delete(commentId: string, userId: string){
        const comment = await this.prismaService.comment.findFirst({
            where:{
                id: commentId,
                userId: userId
            }
        })

        if(!comment){
            throw new NotFoundException("Comment not found")
        }

        return await this.prismaService.comment.delete({
            where: {
                id: commentId
            }
        })
    }

    public async getNumComments(postId: string){
        return (await this.showByPost(postId)).length
    }

}