export const recommendation = (req, res) => {
  const videos = [
    {
      title: "First Video",
      rating: 5,
      comments: 2,
      createAt: "2 minutes ago",
      views: 59,
      id: 1,
    },
    {
      title: "Second Video",
      rating: 3,
      comments: 7,
      createAt: "29 minutes ago",
      views: 159,
      id: 2,
    },
    {
      title: "Third Video",
      rating: 4,
      comments: 21,
      createAt: "58 minutes ago",
      views: 276,
      id: 3,
    },
  ];
  res.render("home", { pageTitle: "Home", videos });
};
export const see = (req, res) => {
  res.render("watch", { pageTitle: "Watch" });
};
export const edit = (req, res) => {
  res.render("edit", { pageTitle: "Edit" });
};
export const search = (req, res) => {
  res.send("Search");
};
export const deleteVideo = (req, res) => {
  return res.send(`Delete Video #${req.params.id}`);
};
export const upload = (req, res) => {
  res.send("Upload video");
};
