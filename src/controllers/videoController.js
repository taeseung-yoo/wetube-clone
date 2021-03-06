import User from "../models/User";
import Video from "../models/Video";
import Comment from "../models/Comment";

export const home = async (req, res) => {
  const videos = await Video.find({})
    .sort({ createdAt: "desc" })
    .populate("owner");
  return res.render("home", { pageTitle: "Home", videos });
};
export const watch = async (req, res) => {
  const { id } = req.params;
  const video = await Video.findById(id).populate("owner").populate({
    path: "comments",
    populate: "owner",
  });
  if (!video) {
    return res.render("404", { pageTitle: "Video Not Found" });
  }
  return res.render("watch", { pageTitle: video.title, video });
};
export const getEdit = async (req, res) => {
  const {
    session: {
      user: { _id },
    },
    params: { id },
  } = req;
  const video = await Video.findById(id);
  if (!video) {
    return res.status(404).render("404", { pageTitle: "Video Not Found" });
  }
  if (String(video.owner) !== String(_id)) {
    req.flash("error", "Not Authorized");
    return res.status(403).redirect(`/videos/${id}`);
  }
  return res.render("edit", { pageTitle: `Edit: ${video.title}`, video });
};
export const postEdit = async (req, res) => {
  const {
    session: {
      user: { _id },
    },
    params: { id },
    body: { title, description, hashtags },
  } = req;
  const video = await Video.findById(id);
  if (!video) {
    return res.status(404).render("404", { pageTitle: "Video Not Found" });
  }
  if (String(video.owner) !== String(_id)) {
    req.flash("error", "You are not the owner of the video");
    return res.status(403).redirect(`/videos/${id}`);
  }
  await Video.findByIdAndUpdate(id, {
    title,
    description,
    hashtags: Video.formatHashtags(hashtags),
  });
  req.flash("success", "Changes Saved");
  return res.redirect(`/videos/${id}`);
};
export const deleteVideo = async (req, res) => {
  const {
    params: { id },
    session: {
      user: { _id },
    },
  } = req;
  const video = await Video.findById(id).populate({
    path: "owner",
    populate: {
      path: "videos comments",
    },
  });
  if (!video) {
    return res.status(404).render("404", { pageTitle: "Video Not Found" });
  }
  if (String(video.owner._id) !== String(_id)) {
    req.flash("error", "You are not the owner of the video");
    return res.status(403).redirect(`/videos/${id}`);
  }
  const commentsIdArray = video.comments;
  await Comment.deleteMany({
    _id: { $in: commentsIdArray },
  });

  video.owner.comments = video.owner.comments.filter(
    (comment) => !commentsIdArray.includes(comment._id)
  );
  video.owner.videos.pull({ _id: id });
  video.owner.save();
  await Video.findByIdAndDelete(id);
  req.flash("success", "Video Deleted");
  return res.redirect("/");
};
export const getUpload = (req, res) => {
  return res.render("upload", { pageTitle: "Upload Video" });
};
export const postUpload = async (req, res) => {
  const {
    session: {
      user: { _id },
    },
    body: { title, description, hashtags },
    files: { video, thumbnail },
  } = req;
  try {
    const isHeroku = process.env.NODE_ENV === "production";
    const newVideo = await Video.create({
      title,
      description,
      fileUrl: isHeroku ? video[0].location : video[0].path,
      thumbnailUrl: isHeroku ? thumbnail[0].location : thumbnail[0].path,
      owner: _id,
      hashtags: Video.formatHashtags(hashtags),
    });
    const user = await User.findById(_id);
    user.videos.push(newVideo._id);
    user.save();
    req.flash("success", "Upload Success");
    return res.redirect("/");
  } catch (error) {
    return res.status(400).render("upload", {
      pageTitle: "Upload Video",
      errorMessage: error._message,
    });
  }
};
export const search = async (req, res) => {
  const { keyword } = req.query;
  let videos = [];
  if (keyword) {
    videos = await Video.find({
      title: {
        $regex: new RegExp(keyword, "i"),
      },
    }).populate("owner");
  }
  return res.render("search", { pageTitle: "Search Video", videos });
};

export const registerView = async (req, res) => {
  const { id } = req.params;
  const video = await Video.findById(id);
  if (!video) {
    return res.sendStatus(404);
  }
  video.meta.views = video.meta.views + 1;
  await video.save();
  return res.sendStatus(200);
};
export const createComment = async (req, res) => {
  const {
    params: { id },
    body: { text },
    session: {
      user: { _id: userId },
    },
  } = req;

  const video = await Video.findById(id);
  if (!video) {
    return res.sendStatus(404);
  }
  const comment = await Comment.create({
    text,
    owner: userId,
    video: id,
  });
  const user = await User.findById(userId);
  user.comments.push(comment._id);
  video.comments.push(comment._id);
  user.save();
  video.save();
  return res.status(201).json({ newCommentId: comment._id });
};
export const deleteComment = async (req, res) => {
  const { id } = req.params;
  const { user } = req.session;
  const comment = await Comment.findById(id)
    .populate({
      path: "video",
      populate: {
        path: "comments",
        model: "Comment",
      },
    })
    .populate({
      path: "owner",
      populate: {
        path: "comments",
        model: "Comment",
      },
    });
  if (!comment) {
    return res.sendStatus(404);
  }
  if (String(user._id) !== String(comment.owner._id)) {
    req.flash("error", "You are not the owner of the comment");
    return res.sendStatus(403);
  }
  comment.owner.comments.pull({ _id: id });
  comment.video.comments.pull({ _id: id });
  comment.owner.save();
  comment.video.save();

  await Comment.findByIdAndDelete(id);
  return res.sendStatus(200);
};
export const updateComment = async (req, res) => {
  const {
    params: { id },
    body: { text },
    session: { user },
  } = req;
  const comment = await Comment.findById(id).populate("owner");
  if (!comment) {
    return res.sendStatus(404);
  }
  if (String(user._id) !== String(comment.owner._id)) {
    req.flash("error", "You are not the owner of the comment");
    return res.sendStatus(403);
  }
  comment.text = text;
  await comment.save();
  return res.sendStatus(200);
};
