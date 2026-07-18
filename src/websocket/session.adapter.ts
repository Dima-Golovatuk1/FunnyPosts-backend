import { IoAdapter } from '@nestjs/platform-socket.io';
import { INestApplicationContext } from '@nestjs/common';
import { ServerOptions, Server } from 'socket.io';

export class SessionIoAdapter extends IoAdapter {
    constructor(
        app: INestApplicationContext,
        private readonly sessionMiddleware: any,
    ) {
        super(app);
    }

    override createIOServer(port: number, options?: ServerOptions): Server {
        const server = super.createIOServer(port, options);

        server.use((socket, next) => {
            this.sessionMiddleware(
                socket.request,
                {} as any,
                next,
            );
        });

        return server;
    }
}