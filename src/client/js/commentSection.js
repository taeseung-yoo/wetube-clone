const videoContainer = document.querySelector("#videoContainer");
const form = document.querySelector("#commentForm");
const deleteBtn = document.querySelectorAll("#comments__delete-btn");
const updateBtn = document.querySelectorAll("#comments__update-btn");

const handleSubmit = async (event) => {
  event.preventDefault();
  const input = form.querySelector("input");
  const text = input.value;
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
    location.reload();
  }
};

const handleDeleteComment = async (event) => {
  const comment = event.target.parentElement.parentElement;
  const id = comment.dataset.commentid;
  const response = await fetch(`/api/comments/${id}/delete`, {
    method: "DELETE",
  });
  if (response.status === 200) {
    const countSpan = document.querySelector(".video__comments span");
    const countComments = parseInt(countSpan.innerText.slice(3, -1));
    countSpan.innerText = `댓글 ${countComments - 1}개`;
    comment.remove();
  }
};

const handleConfirmUpdate = async (event) => {
  const comment = event.target.parentElement.parentElement;
  const input = comment.querySelector("input");
  const text = input.value;
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
    const textSpan = comment.querySelector(".comment__new-text");
    const span = document.createElement("span");
    const clickedUpdateBtn = event.target;
    span.innerText = text;
    span.className = "comment__text";
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
  const textSpan = comment.querySelector(".comment__text");
  const input = document.createElement("input");
  input.type = "text";
  input.required = true;
  input.placeholder = "Write a new commment...";
  input.value = textSpan.innerText;
  input.className = "comment__new-text";
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
