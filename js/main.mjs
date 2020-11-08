import postApi from "./api/postApi.js";
import utils from "./utils.js";
import AppConstants from "./appConstants.js";

const renderPostList = (postList) => {
  const ulElement = document.querySelector("#postsList");

  postList.forEach((post) => {
    // Get template
    const templateElement = document.querySelector("#postItemTemplate");
    if (!templateElement) return;

    // Clone li
    const liElementFromTemplate = templateElement.content.querySelector("li");
    const newLiElement = liElementFromTemplate.cloneNode(true);

    // set image
    const imageElement = newLiElement.querySelector("#postItemImage");
    if (imageElement) {
      imageElement.src = post.imageUrl;
    }

    // set title
    const titleElement = newLiElement.querySelector("#postItemTitle");
    if (titleElement) {
      titleElement.textContent = post.title;
    }

    // set description
    const descriptionElement = newLiElement.querySelector(
      "#postItemDescription"
    );
    if (descriptionElement) {
      descriptionElement.textContent = post.description;
    }

    // set author
    const authorElement = newLiElement.querySelector("#postItemAuthor");
    if (authorElement) {
      authorElement.textContent = post.author;
    }

    // set time
    const timeSpanElement = newLiElement.querySelector("#postItemTimeSpan");
    if (timeSpanElement) {
      timeSpanElement.textContent = `${utils.formatDate(post.updatedAt)}`;
    }

    // Add click event for student div
    const divElement = newLiElement.querySelector("#postItem");
    if (divElement) {
      divElement.addEventListener("click", () => {
        window.location = `/post-detail.html?id=${post.id}`;
      });
    }

    // Add click event for edit button
    const editElement = newLiElement.querySelector("#postItemEdit");
    if (editElement) {
      editElement.addEventListener("click", (e) => {
        // Stop bubbling
        e.stopPropagation();

        window.location = `/add-edit-post.html?id=${post.id}`;
      });
    }

    // Add click event for remove button
    const removeElement = newLiElement.querySelector("#postItemRemove");
    if (removeElement) {
      removeElement.addEventListener("click", async (e) => {
        // Stop bubbling
        e.stopPropagation();

        // Ask user whether they want to delete
        const message = `Are you sure to remove post ${post.title}?`;
        if (window.confirm(message)) {
          try {
            await postApi.remove(post.id);

            // remove li element
            newLiElement.remove();
          } catch (error) {
            console.log("Failed to remove post:", error);
          }
        }
      });
    }

    // Append li to ul
    ulElement.appendChild(newLiElement);
  });
};

// MAIN
// IIFE -- iffy
(async function () {
  try {
    // Retrieve city from URL params
    const urlParams = new URLSearchParams(window.location.search);
    const city = urlParams.get("city");
    const params = { _page: 1, _limit: 6 };

    const response = await postApi.getAll(params);
    const postList = response.data;
    console.log(postList);

    // hide loading
    const spinnerElement = document.querySelector("#spinner");
    if (spinnerElement) {
      spinnerElement.classList.add("d-none");
    }

    // render
    renderPostList(postList);
  } catch (error) {
    console.log("Failed to fetch post list", error);
  }
})();
