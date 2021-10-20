import { NextFunction, Request, Response } from "express";
import { UserDocument } from "../user/user.schema";
import { isNil } from "ramda";
import constant from "../common/constant";
import Jwt from "jsonwebtoken";
import config from "config";
import { AuthRequest, IToken } from "./auth.interface";
import { TokenDataResponse } from "../app.interface";


declare global {
  namespace Express{
    interface Request {
      user: string;
    }
  }
}

interface IUserPayload {
  userId: string;
  email: string;
  iat: number;
}
export const ValidateRequestBody = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const input: UserDocument = req.body;
  const { userName, email, password, contactNo } = input;
  if (isNil(userName)) {
    return res.status(constant.INVALID_PARAMETER).json({
      status: false,
      message: "User name is required",
    });
  }

  if (isNil(email)) {
    return res.status(constant.INVALID_PARAMETER).json({
      status: false,
      message: "Email is required",
    });
  }

  if (isNil(password)) {
    return res.status(constant.INVALID_PARAMETER).json({
      status: false,
      message: "Password is required",
    });
  }

  if (isNil(contactNo)) {
    return res.status(constant.INVALID_PARAMETER).json({
      status: false,
      message: "Contact No is required",
    });
  }

  next();
};

export const isAuth = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { authorization = null } = req["headers"] || {};
  const authorizationHeaderProvided = !isNil(authorization);
  const secretTkn = config.get("JWT_TOKEN") as string;
  if (!authorizationHeaderProvided) {
    return res.status(constant.UNAUTHORIZED).json({
      message: "UNAUTHORIZED",
      data: ["You need to provide authorization token"],
    });
  }

  const accessToken = authorization.split(" ")[1];
  if (!accessToken) {
    return res.status(constant.UNAUTHORIZED).json({
      message: "UNAUTHORIZED",
      data: ["You need to provide authorization token"],
    });
  }

  
  const isMatch = Jwt.verify(accessToken, secretTkn) as IUserPayload;
  req.user = isMatch.userId;
  if (!isMatch) {
    return res.status(constant.UNAUTHORIZED).json({
      message: "UNAUTHORIZED",
      data: ["Authorization token is Not Valid"],
    });
  }

  return next();
};

const verifyToken = (
  token: string,
  secretTkn: string
): Promise<TokenDataResponse<IToken.Payload>> =>
  new Promise((resolve) => {
    Jwt.verify(token, secretTkn, (err, payload) => {
      isNil(err)
        ? resolve({ error: null, data: payload as IToken.Payload })
        : resolve({
            error: "Token is Expired",
            data: null,
          });
    });
  });
