import { Request, Response, Router } from "express";
import { isAuth } from "../auth/auth.middleware";
import { addBlogs, fetchBlogs, markAsDeleted, updateBlog } from "./blog.service";
const blogRouter = Router();

// get all blogs
blogRouter.get("/", isAuth, async (req: Request, res: Response) => {
  const response = await fetchBlogs();
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

// Insert blog 
blogRouter.post("/", isAuth, async (req: Request, res: Response) => {
  const response = await addBlogs(req.body, req.user);
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


// Update Blog 
blogRouter.patch('/:id', isAuth, async (req: Request, res: Response) => {
  const blogId: string = req.params.id;
  const response = await updateBlog(blogId, req.body);
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

// check if blog contains userId or not, if not then set as deleted
blogRouter.patch('/mark-deleted', isAuth, async (req: Request, res: Response) => {
  const response = await markAsDeleted();
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



export default blogRouter;
