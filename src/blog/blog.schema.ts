import { Schema, model, Document } from "mongoose";
export interface BlogDocument extends Document {
  title: string;
  description: string;
  createdBy: string;
  deletedAt: Date;
}

const BlogSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    deletedAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

export const Blog = model<BlogDocument>("blog", BlogSchema);
