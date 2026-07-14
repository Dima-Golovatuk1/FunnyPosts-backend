import { Module } from '@nestjs/common';
import { PostService } from './services/post.service';
import { PostController } from './controllers/post.controller';
import { StorageModule } from '@/storage/storage.module';
import { UserModule } from '@/user/user.module';
import { PrismaModule } from '@/prisma/prisma.module';
import { LikeController } from './controllers/like.controller';
import { LikeServise } from './services/like.service';
import { CommentController } from './controllers/comment.controller';
import { CommentService } from './services/comment.service';

@Module({
    imports: [StorageModule, UserModule, PrismaModule],
    controllers: [PostController, LikeController, CommentController],
    providers: [PostService, LikeServise, CommentService],
})
export class PostModule {}
