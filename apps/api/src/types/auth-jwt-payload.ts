import { JWTPayload } from "jose";

export interface AuthJWTPayload extends JWTPayload {
    kid?: string;
    sid?: string;
}
