import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CommentService } from '../services/comment.service';
import { CreateCommentDto } from '../dto/create-comment';
import { Authorization } from '@/auth/decorators/auth.decorator';
import { Authorized } from '@/auth/decorators/authorized.decorator';

@ApiTags('Posts')
@Controller('posts/:postId/comments')
export class CommentController {
    constructor(private readonly commentService: CommentService) {}

    @Authorization()
    @Post('add')
    async add(
        @Body() dto: CreateCommentDto,
        @Authorized('id') userId,
        @Param('postId') postId: string,
    ) {
        return await this.commentService.add(dto, postId, userId);
    }

    @Authorization()
    @Post('delete/:commentId')
    async delete(
        @Param('commentId') commentId: string,
        @Authorized('id') userId: string,
    ) {
        return await this.commentService.delete(commentId, userId);
    }

    @Get('show')
    async show(@Param('postId') postId: string) {
        return await this.commentService.showByPost(postId);
    }

    @Get('num-comment')
    async getAllLikes(@Param('postId') postId: string) {
        return this.commentService.getNumComments(postId);
    }
}
