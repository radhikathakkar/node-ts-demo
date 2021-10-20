import { User, UserDocument } from "../user/user.schema";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import config from "config";
import { IResponse } from "../common/response";
import { IUser } from "../user/user.interface";
import { ServiceResponse } from "../app.interface";
import constant from "../common/constant";

// Add user to user table
export const addUser = async (
  input: UserDocument
): Promise<ServiceResponse<IResponse>> => {
  const { email, userName } = input;
  const checkEmail = await validateEmail(email);
  if (checkEmail.status) {
    return {
      error: "Email Address is Already Exists",
      data: null,
      status: false,
      statusCode: constant.DATA_NOT_FOUND,
    };
  }

  const checkUserName = await validateUsername(userName);
  if (checkUserName.status) {
    return {
      error: "User name is Already Exists",
      data: null,
      status: false,
      statusCode: constant.DATA_NOT_FOUND,
    };
  }
  const newUser = new User({
    ...input,
  });
  await encryptPassword(newUser);

  const token = generateToken(newUser);
  return {
    error: null,
    status: true,
    statusCode: constant.SUCCESS,
    data: {
      token,
      message: "User Added Successfully",
    },
  };
};

// encrypt user given password to hash password
const encryptPassword = async (newUser: UserDocument): Promise<void> => {
  await bcrypt.hash(newUser.password, 10, async (err, hash: string) => {
    if (err) throw err;
    newUser.password = hash;
    await newUser.save();
  });
};

// generate jwt token
const generateToken = (user: any): string => {
  const { _id: id, email } = user.toObject();

  const secretTkn = config.get("JWT_TOKEN") as string;
  const token = jwt.sign(
    {
      userId: id,
      email,
    },
    secretTkn
  );

  return token;
};

// validate login credentials
export const login = async (
  userName: string,
  password: string
): Promise<ServiceResponse<IResponse>> => {
  const user = await User.findOne({
    userName,
  });
  if (!user) {
    return {
      error: "User name is Already Exists",
      data: null,
      status: false,
      statusCode: constant.BAD_REQUEST,
    };
  }

  const { password: userHashPass } = user.toObject();
  const isMatch = await comparePassword(password, userHashPass);
  if (!isMatch) {
    return {
      error: "Password is Incorrect.",
      data: null,
      status: false,
      statusCode: constant.BAD_REQUEST,
    };
  }
  const token = generateToken(user);
  return {
    error: null,
    data: {
      token,
      message: "Login success",
    },
    status: true,
    statusCode: constant.SUCCESS,
  };
};

const validateEmail = async (email: string): Promise<{ status: boolean }> => {
  const userDoc = await User.findOne({
    email,
  });
  if (!userDoc) {
    return {
      status: false,
    };
  }
  return {
    status: true,
  };
};

const validateUsername = async (userName: string) => {
  const userDoc = await User.findOne({
    userName,
  });
  if (!userDoc) {
    return {
      status: false,
      data: null,
    };
  }
  return {
    status: true,
    data: userDoc.toObject(),
  };
};

// compare user given password with hash password
const comparePassword = async (
  password: string,
  hashPass: string
): Promise<boolean> => {
  return await bcrypt.compare(password, hashPass);
};
