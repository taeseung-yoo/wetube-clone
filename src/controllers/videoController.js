let videos = [
  {
    title: "First Video",
    rating: 5,
    comments: 2,
    createAt: "2 minutes ago",
    views: 10,
    id: 0,
  },
  {
    title: "Second Video",
    rating: 3,
    comments: 7,
    createAt: "29 minutes ago",
    views: 159,
    id: 1,
  },
  {
    title: "Third Video",
    rating: 4,
    comments: 21,
    createAt: "58 minutes ago",
    views: 276,
    id: 2,
  },
];

export const recommendation = (req, res) => {
  res.render("home", { pageTitle: "Home", videos });
};
export const watch = (req, res) => {
  const { id } = req.params;
  const video = videos[id];
  res.render("watch", { pageTitle: `Watching: ${video.title}`, video });
};
export const getEdit = (req, res) => {
  const { id } = req.params;
  const video = videos[id];
  res.render("edit", { pageTitle: `Editing: ${video.title}`, video });
};
export const postEdit = (req, res) => {
  const { id } = req.params;
  const { title } = req.body;
  videos[id].title = title;
  return res.redirect(`/videos/${id}`);
};
