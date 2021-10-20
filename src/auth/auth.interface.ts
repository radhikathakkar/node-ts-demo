import { Request } from "express";

export type AuthRequest = Request & {
  userId: string;
};

export type IPayload = {
  userId: string;
  email: string;
  iat: number;
};

export namespace IToken {
  export type Payload = {
    user: string;
    jti: string;
  };
}
