import { Router, Request, Response } from "express";
import { UserDocument } from "../user/user.schema";
import { addUser, login } from "./auth.service";
import { isNil } from "ramda";
import constant from "../common/constant";
import { ValidateRequestBody } from "./auth.middleware";
import { IResponse } from "../common/response";
const router = Router();

router.get("/", async (req: Request, res: Response) => {
  res.status(constant.SUCCESS).send("working");
});

// register user
router.post(
  "/register",
  ValidateRequestBody,
  async (req: Request, res: Response) => {
    const body: UserDocument = req.body;
    const response = await addUser(body);
    const { error, status, data, statusCode } = response;
    if (error) {
      return res.status(statusCode).json({
        success: status,
        message: error,
      });
    }

    return res.status(statusCode).json({
      success: status,
      data,
    });
  }
);

// register user
router.post("/login", async (req: Request, res: Response) => {
  const body: UserDocument = req.body;
  const {userName, password} = body;
  const response = await login(userName, password);
  const { error, status, data, statusCode } = response;
  if (error) {
    return res.status(statusCode).json({
      success: status,
      message: error,
    });
  }

  return res.status(statusCode).json({
    success: status,
    data,
  });
});

export default router;
