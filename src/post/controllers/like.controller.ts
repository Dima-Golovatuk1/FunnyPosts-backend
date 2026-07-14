import { Authorization } from "@/auth/decorators/auth.decorator";
import { Authorized } from "@/auth/decorators/authorized.decorator";
import { Controller, Get, Param, Post } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { LikeServise } from "../services/like.service";

@ApiTags('Posts')
@Controller(':postId/')
export class LikeController{
    constructor(private readonly likeServise: LikeServise){}

    @Authorization()
    @Post('like')
    async addLike(@Param('postId') postId: string, @Authorized('id') userId: string){
        return this.likeServise.addOrRemoveLike(postId, userId, 'POST')
    }

    @Get('num-like')
    async getAllLikes(@Param('postId') postId: string){
        return this.likeServise.getNumLikes(postId)
    }

}