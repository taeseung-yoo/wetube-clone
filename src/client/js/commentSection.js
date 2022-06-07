const videoContainer = document.querySelector("#videoContainer");
const form = document.querySelector("#commentForm");
const deleteBtn = document.querySelectorAll("#comments__delete-btn");

const addComment = (text, newCommentId) => {
  const videoComments = document.querySelector(".video__comments ul");
  const newComment = document.createElement("li");
  newComment.className = "video__comment";
  newComment.dataset.commentid = newCommentId;
  const div = document.createElement("div");
  div.className = "comments__column";
  const div2 = document.createElement("div");
  div2.className = "comments__column";
  div2.id = "comments__delete-btn";
  div2.addEventListener("click", handleDeleteComment);
  const icon = document.createElement("i");
  icon.className = "fas fa-comment";
  const span = document.createElement("span");
  span.innerText = ` ${text}`;
  const span2 = document.createElement("span");
  span2.innerText = "❌";
  div.appendChild(icon);
  div.appendChild(span);
  div2.appendChild(span2);
  newComment.appendChild(div);
  newComment.appendChild(div2);
  videoComments.prepend(newComment);
};

const handleSubmit = async (event) => {
  event.preventDefault();
  const textarea = form.querySelector("textarea");
  const text = textarea.value;
  const id = videoContainer.dataset.videoid;
  if (text === "") {
    return;
  }
  const response = await fetch(`/api/videos/${id}/comment`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ text }),
  });
  if (response.status === 201) {
    textarea.value = "";
    const { newCommentId } = await response.json();
    addComment(text, newCommentId);
  }
};

const handleDeleteComment = async (event) => {
  const comment = event.target.parentElement.parentElement;
  const id = comment.dataset.commentid;
  const response = await fetch(`/api/comments/${id}/delete`, {
    method: "DELETE",
  });
  if (response.status === 200) {
    comment.remove();
  }
};

if (form) {
  form.addEventListener("submit", handleSubmit);
}
if (deleteBtn) {
  deleteBtn.forEach((item) => {
    item.addEventListener("click", handleDeleteComment);
  });
}
