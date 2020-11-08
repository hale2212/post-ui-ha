import postApi from "./api/postApi.js";
import utils from "./utils.js";

const renderPost = (post) => {
  const postElement = document.querySelector(".post-detail");

  // set bg
  const postHeroImageElement = document.querySelector("#postHeroImage");
  if (postHeroImageElement) {
    postHeroImageElement.style.backgroundImage = `url(${post.imageUrl})`;
  }

  // set date
  const postDetailTimeSpanElement = document.querySelector(
    "#postDetailTimeSpan"
  );
  if (postDetailTimeSpanElement) {
    postDetailTimeSpanElement.textContent = `${utils.formatDate(
      post.updatedAt
    )}`;
  }

  // set author
  const postAuthor = postElement.querySelector("#postDetailAuthor");
  if (postAuthor) {
    postAuthor.textContent = post.author;
  }

  // set title
  const postTitle = postElement.querySelector("#postDetailTitle");
  if (postTitle) {
    postTitle.textContent = post.title;
  }

  // set content
  const postContent = postElement.querySelector("#postDetailDescription");
  if (postContent) {
    postContent.textContent = post.content;
  }
};

const main = async () => {
  const params = new URLSearchParams(window.location.search);
  const postId = params.get("id");
  const post = await postApi.get(postId);

  renderPost(post);

  const editLink = document.querySelector("#goToEditPageLink");
  if (editLink) {
    editLink.href = `/add-edit-post.html?id=${post.id}`;
    editLink.innerHTML = '<i class = "fas fa-edit"></i> Edit post';
  }
};

main();
