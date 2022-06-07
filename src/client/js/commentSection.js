const videoContainer = document.querySelector("#videoContainer");
const form = document.querySelector("#commentForm");
const deleteBtn = document.querySelectorAll("#comments__delete-btn");
const updateBtn = document.querySelectorAll("#comments__update-btn");

const addComment = (text, newCommentId) => {
  const videoComments = document.querySelector(".video__comments ul");
  const newComment = document.createElement("li");
  newComment.className = "video__comment";
  newComment.dataset.commentid = newCommentId;
  const div = document.createElement("div");
  div.className = "comments__column";
  const div2 = document.createElement("div");
  div2.className = "comments__column";
  const icon = document.createElement("i");
  icon.className = "fas fa-comment";
  const span = document.createElement("span");
  span.innerText = ` ${text}`;
  const span2 = document.createElement("span");
  span2.innerText = "✏️";
  const span3 = document.createElement("span");
  span3.innerText = "❌";
  span3.addEventListener("click", handleDeleteComment);
  span2.id = "comments__update-btn";
  span3.id = "comments__delete-btn";
  div.appendChild(icon);
  div.appendChild(span);
  div2.appendChild(span2);
  div2.appendChild(span3);
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

const handleConfirmUpdate = async (event) => {
  const comment = event.target.parentElement.parentElement;
  const textarea = comment.querySelector("textarea");
  const text = textarea.value;
  const commentId = comment.dataset.commentid;
  if (text === "") {
    return;
  }
  const response = await fetch(`/api/comments/${commentId}/update`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ text }),
  });
  if (response.status === 200) {
    const textSpan = comment.querySelector(".comments__column textarea");
    const span = document.createElement("span");
    const clickedUpdateBtn = event.target;
    span.innerText = text;
    textSpan.parentElement.appendChild(span);
    textSpan.remove();
    clickedUpdateBtn.innerText = "✏️";
    clickedUpdateBtn.removeEventListener("click", handleConfirmUpdate);
    clickedUpdateBtn.addEventListener("click", handleUpdateComment);
  }
};

const handleUpdateComment = (event) => {
  const clickedUpdateBtn = event.target;
  const comment = clickedUpdateBtn.parentElement.parentElement;
  const textSpan = comment.querySelector(".comments__column span");
  const input = document.createElement("textarea");
  input.type = "text";
  input.required = true;
  input.placeholder = "Write a new commment...";
  input.value = textSpan.innerText;
  textSpan.parentElement.appendChild(input);
  textSpan.remove();
  clickedUpdateBtn.innerText = "✔️";
  clickedUpdateBtn.removeEventListener("click", handleUpdateComment);
  clickedUpdateBtn.addEventListener("click", handleConfirmUpdate);
};

if (form) {
  form.addEventListener("submit", handleSubmit);
}
if (deleteBtn) {
  deleteBtn.forEach((item) => {
    item.addEventListener("click", handleDeleteComment);
  });
}
if (updateBtn) {
  updateBtn.forEach((item) => {
    item.addEventListener("click", handleUpdateComment);
  });
}
