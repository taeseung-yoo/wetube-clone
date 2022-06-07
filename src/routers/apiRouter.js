import express from "express";
import {
  registerView,
  createComment,
  deleteComment,
  updateComment,
} from "../controllers/videoController";

const apiRouter = express.Router();

apiRouter.post("/videos/:id([0-9a-f]{24})/view", registerView);
apiRouter.post("/videos/:id([0-9a-f]{24})/comment", createComment);
apiRouter.delete("/comments/:id([0-9a-f]{24})/delete", deleteComment);
apiRouter.post("/comments/:id([0-9a-f]{24})/update", updateComment);

export default apiRouter;
