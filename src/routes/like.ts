import express from "express";
import {ensureAuthUser} from "@/middlewares/authentication";
import {Like} from "@/models/like";

export const likeRouter = express.Router();

likeRouter.post("/:postId", ensureAuthUser, async (req, res, next) => {
  const {postId} = req.params;
  const currentUserId = req.authentication?.currentUserId;
  if (currentUserId === undefined) {
    // `ensureAuthUser` enforces `currentUserId` is not undefined.
    // This must not happen.
    return next(new Error("Invalid error: currentUserId is undefined."));
  }
  const like = new Like(currentUserId, Number(postId));
  await like.save();
  res.redirect(`/get_post/${postId}`);
});

likeRouter.delete("/:postId", ensureAuthUser, async (req, res, next) => {
  const {postId} = req.params;
  const currentUserId = req.authentication?.currentUserId;
  if (currentUserId === undefined) {
    // `ensureAuthUser` enforces `currentUserId` is not undefined.
    // This must not happen.
    return next(new Error("Invalid error: currentUserId is undefined."));
  }
  const like = await Like.find(currentUserId, Number(postId));
  await like?.delete();
  res.redirect(`/get_post/${postId}`);
});
