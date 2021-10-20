import { ServiceResponse } from "../app.interface";
import constant from "../common/constant";
import { IResponse } from "../common/response";
import { IBlog } from "./blog.interface";
import { Blog, BlogDocument } from "./blog.schema";

export const fetchBlogs = async (): Promise<ServiceResponse<IResponse>> => {
  const blogDocs = await Blog.find({
    deletedAt: { $exists: false },
  });
  if (!blogDocs.length) {
    return {
      error: "No Blogs Found",
      data: null,
      status: false,
      statusCode: constant.DATA_NOT_FOUND,
    };
  }

  return {
    error: null,
    data: {
      result: blogDocs,
      message: "Blogs Fetch Successfully.",
    },
    status: true,
    statusCode: constant.SUCCESS,
  };
};

export const addBlogs = async (
  input: IBlog,
  userId: string
): Promise<ServiceResponse<IResponse>> => {
  const blog = new Blog({
    ...input,
    createdBy: userId,
  });
  await blog.save();
  if (!blog) {
    return {
      error: "No Blogs Added",
      data: null,
      status: false,
      statusCode: constant.BAD_REQUEST,
    };
  }

  return {
    error: null,
    data: {
      result: blog,
      message: "Blogs Added Successfully.",
    },
    status: true,
    statusCode: constant.SUCCESS,
  };
};

export const updateBlog = async (
  blogId: string,
  input: BlogDocument
): Promise<ServiceResponse<IResponse>> => {
  const blog = await Blog.findOneAndUpdate(
    {
      _id: blogId
    },
    {
      $set: {
        ...input
      }
    }
  );

  if (!blog) {
    return {
      error: "Blog is not updated",
      data: null,
      status: false,
      statusCode: constant.BAD_REQUEST,
    };
  };
  
  return {
    error: null,
    data: {
      message: 'Blog Updated Successfully.',
      result: blog
    },
    status: true,
    statusCode: constant.SUCCESS,
  };
}

export const markAsDeleted = async (): Promise<ServiceResponse<IResponse>> => {
  const blogDocs = await Blog.find({
    deletedAt: { $exists: false },
  });
  if (!blogDocs.length) {
    return {
      error: "No Blogs Found",
      data: null,
      status: false,
      statusCode: constant.BAD_REQUEST,
    };
  }

  for await (const blog of blogDocs) {
    if (!blog.createdBy) {
      blog.deletedAt = new Date();
      await blog.save();
    }
  }

  return {
    error: null,
    data: {
      message: 'Done Successfully.'
    },
    status: true,
    statusCode: constant.SUCCESS,
  };
};
