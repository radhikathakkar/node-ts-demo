import express from "express";
import config from "config";
import connect from "./connection";
import cors from "cors";
import router from "./auth";
import blogRouter from "./blog";
const app = express();
const port = config.get("port");

app.listen(port, () => {
  console.log("server running", port);
  connect();
});

app.use(cors());
app.use(express.json());

app.use("/auth", router);
app.use("/blog", blogRouter);
