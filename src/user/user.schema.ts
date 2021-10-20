import { Schema, model, Document } from "mongoose";
import bcrypt from "bcrypt";

export interface UserDocument extends Document {
  name: string;
  userName: string;
  email: string;
  contactNo: Number;
  password: string;
  age: Number;
  dob: Date;
  role: string;
  deletedAt: Date;
}

const UserSchema = new Schema(
  {
    name: {
      type: String,
    },
    userName: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    contactNo: {
      type: Number,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    age: {
      type: Number,
    },
    dob: {
      type: Date,
    },
    role: {
      type: String,
      required: true,
      default: "user",
    },
    deletedAt: { type: Date },
  },
  {
    timestamps: true
  }
);

export const User = model<UserDocument>("user", UserSchema);
