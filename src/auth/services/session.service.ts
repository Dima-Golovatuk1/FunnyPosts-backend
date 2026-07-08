import { Injectable, InternalServerErrorException } from "@nestjs/common";
import { User } from "@prisma/client";
import { Request } from "express";

@Injectable()
export class SessionService {
    public async saveSession(req: Request, user: User) {
        return new Promise((resolve, reject) => {
            req.session.userId = user.id;

            req.session.save((error) => {
                if (error) {
                    return reject(
                        new InternalServerErrorException(
                            'failed to save session. Check if the session settings parameters are configured correctly',
                        ),
                    );
                }
                resolve({
                    user,
                });
            });
        });
    }
}