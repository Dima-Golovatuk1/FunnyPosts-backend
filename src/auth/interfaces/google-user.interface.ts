export interface GoogleUser{
    providerId: string;
    email: string;
    name: string;
    picture: string;
    accessToken: string;
    refreshToken?: string;
}