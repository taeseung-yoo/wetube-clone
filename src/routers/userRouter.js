import express from "express";

const userRouter = express.Router();
const handleEditLogin = (req, res) => {
  res.send("Edit User");
};

userRouter.get("/users", handleEditLogin);

export default userRouter;
