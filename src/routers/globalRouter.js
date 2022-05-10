import express from "express";
import { recommendation } from "../controllers/videoController";
import { join, login } from "../controllers/userController";

const globalRouter = express.Router();

globalRouter.get("/", recommendation);
globalRouter.get("/join", join);
globalRouter.get("/login", login);

export default globalRouter;
