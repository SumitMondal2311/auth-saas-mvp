import { Request } from "express";

export type SignupClient = {
    id: string;
    emailAddress: string;
    codeHash: string;
    passwordHash: string;
};

export interface VerificationMiddlewareRequest extends Request {
    client?: SignupClient;
}
