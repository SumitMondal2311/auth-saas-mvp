import "express";
import "http";

declare module "express" {
    interface Request {
        applicationInfo?: {
            username: boolean;
            google: boolean;
            id: string;
            github: boolean;
            publishableKey: string;
        };
        currSessionInfo?: {
            userId: string;
            id: string;
            accountId: string;
        };
    }
}

declare module "http" {
    interface IncomingHttpHeaders {
        "x-publishable-key": string;
    }
}
