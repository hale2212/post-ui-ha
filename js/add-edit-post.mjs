import postApi from "./api/postApi.js";
import AppConstants from "./appConstants.js";

const setFormValues = (post) => {
  // set value of image
  const imageHeroElement = document.querySelector("#postHeroImage");
  if (imageHeroElement) {
    imageHeroElement.style.backgroundImage = `url(${post.imageUrl})`;
  }

  // set value of title
  const titleInput = document.querySelector("#postTitle");
  if (titleInput) {
    titleInput.value = post.title;
  }

  // set value of author
  const authorInput = document.querySelector("#postAuthor");
  if (authorInput) {
    authorInput.value = post.author;
  }

  // set value of description
  const descriptionInput = document.querySelector("#postDescription");
  if (descriptionInput) {
    descriptionInput.value = post.description;
  }
};

const handleChangeImageClick = () => {
  const randomId = 1 + Math.trunc(Math.random() * 1000);

  const imageUrl = `https://picsum.photos/id/${randomId}/${AppConstants.DEFAULT_IMAGE_WIDTH}/${AppConstants.DEFAULT_IMAGE_HEIGHT}`;

  const element = document.querySelector("#postHeroImage");
  if (element) {
    element.style.backgroundImage = `url(${imageUrl})`;
    element.addEventListener("error", handleChangeImageClick);
  }
};

const changeBackgroundButton = document.querySelector("#postChangeImage");
if (changeBackgroundButton) {
  changeBackgroundButton.addEventListener("click", handleChangeImageClick);
}

const getImageUrlFromString = (str) => {
  const firstDoubleQuotePosition = str.indexOf('"');
  const lastDoubleQuotePosition = str.lastIndexOf('"');
  return str.slice(firstDoubleQuotePosition + 1, lastDoubleQuotePosition);
};

// get formvalue
const getFormValues = () => {
  // if (!form) return {};

  const formValues = {};

  // Get value of image
  const imageHeroElement = document.querySelector("#postHeroImage");
  if (imageHeroElement) {
    formValues.imageUrl = getImageUrlFromString(
      imageHeroElement.style.backgroundImage
    );
  }

  // Get value of title
  const titleInput = document.querySelector("#postTitle");
  if (titleInput) {
    formValues.title = titleInput.value;
  }

  // Get value of author
  const authorInput = document.querySelector("#postAuthor");
  if (authorInput) {
    formValues.author = authorInput.value;
  }

  // Get selected description
  const descriptionInput = document.querySelector("#postDescription");
  if (descriptionInput) {
    formValues.description = descriptionInput.value;
  }

  return formValues;
};

// validation input
const validateForm = () => {
  let isValid = true;

  // title
  const titleInput = document.querySelector("#postTitle");
  const title = titleInput.value;
  if (!title) {
    titleInput.classList.add("is-invalid");
    isValid = false;
  }

  // author
  const authorInput = document.querySelector("#postAuthor");
  const author = authorInput.value;
  if (!author) {
    authorInput.classList.add("is-invalid");
    isValid = false;
  }

  return isValid;
};

const handleFormSubmit = async (postId) => {
  const formValues = getFormValues();

  // console.log(formValues);
  const isValid = validateForm(formValues);

  if (!isValid) return;
  try {
    if (postId) {
      const savePostButtonElement = document.querySelector("#savePostButton");
      savePostButtonElement.innerHTML =
        '<span class="spinner-grow spinner-grow-sm" role="status" aria-hidden="true"></span>Loading...';
      savePostButtonElement.disabled = true;

      formValues.id = postId;
      const newUpPost = await postApi.update(formValues);
      alert("Save post successfully");
      window.location = `./post-detail.html?id=${newUpPost.id}`;
    } else {
      const savePostButtonElement = document.querySelector("#savePostButton");
      savePostButtonElement.innerHTML =
        '<span class="spinner-grow spinner-grow-sm" role="status" aria-hidden="true"></span>Loading...';
      savePostButtonElement.disabled = true;

      const newPost = await postApi.add(formValues);

      window.location = `./post-detail.html?id=${newPost.id}`;

      alert("Add new post successfully");
    }
  } catch (error) {
    console.log("Can't update data", error);
  }
};

(async () => {
  const params = new URLSearchParams(window.location.search);
  const postId = params.get("id");
  const isEditMode = !!postId;

  if (isEditMode) {
    const post = await postApi.get(postId);
    // console.log(post);

    setFormValues(post);

    const goToDetailPageLink = document.querySelector("#goToDetailPageLink");
    goToDetailPageLink.href = `./post-detail.html?id=${post.id}`;
    goToDetailPageLink.innerHTML =
      '<i class="fas fa-eye mr-1"></i> View post detail';
  } else {
    handleChangeImageClick();
  }

  // add event submit
  const formElement = document.querySelector("#postForm");
  if (formElement) {
    formElement.addEventListener("submit", (e) => {
      handleFormSubmit(postId);
      e.preventDefault();
    });
  }

  // event click change bg image
  const imageHeroElement = document.querySelector("#postHeroImage");
  if (imageHeroElement) {
    imageHeroElement.onerror = handleChangeImageClick;
  }
})();
