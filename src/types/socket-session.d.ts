import 'http';

declare module 'http' {
    interface IncomingMessage {
        session: any;
    }
}