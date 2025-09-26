import { Request } from "express";
import { z } from "zod";
import { passwordSchema, verificationCodeSchema } from "../../../configs/schemas.js";

export interface FactorOneMiddlewareRequest extends Request {
    client?: FactorOneClient;
}

type BaseClient = {
    userId: string;
    id: string;
    accountId: string;
};

export type FactorTwoClient = BaseClient & {
    factor: "Two";
    codeHash: string;
};

export type FactorOneClient =
    | (BaseClient & {
          emailAddress: string;
          codeHash: string;
          strategy: "email_code";
      })
    | (BaseClient & {
          emailAddress: string;
          strategy: "password";
          passwordHash: string;
      });

export type AttemptFactorOneInput =
    | z.infer<typeof verificationCodeSchema>
    | z.infer<typeof passwordSchema>;
