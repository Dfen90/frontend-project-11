import onChange from "on-change";
import i18n from "./i18n.js";

const renderFeeds = (elements, feeds) => {
  const { feedsContainer } = elements;
  const feedsList = feeds
    .map(
      (feed) => `
    <div class="card mb-3">
      <div class="card-body">
        <h2 class="card-title h4">${feed.title}</h2>
        <p class="card-text">${feed.description}</p>
      </div>
    </div>
  `
    )
    .join("");

  feedsContainer.innerHTML = feedsList;
};

const renderPosts = (elements, posts) => {
  const { postsContainer } = elements;
  const postsList = posts
    .map(
      (post) => `
    <div class="card mb-2">
      <div class="card-body">
        <a href="${post.link}" target="_blank">${post.title}</a>
      </div>
    </div>
  `
    )
    .join("");

  postsContainer.innerHTML = postsList;
};

const renderErrors = (elements, error) => {
  const { input, feedback } = elements;

  if (error) {
    input.classList.add("is-invalid");
    feedback.classList.add("text-danger");
    feedback.textContent = i18n.t(error);
  } else {
    input.classList.remove("is-invalid");
    feedback.classList.remove("text-danger");
    feedback.textContent = "";
  }
};

const handleProcessState = (elements, processState) => {
  const { submit, input } = elements;

  switch (processState) {
    case "filling":
      submit.disabled = false;
      input.readOnly = false;
      break;
    case "sending":
      submit.disabled = true;
      input.readOnly = true;
      break;
    default:
      break;
  }
};

const initView = (state, elements) => {
  const watchedState = onChange(state, (path, value) => {
    switch (path) {
      case "form.error":
        renderErrors(elements, value);
        break;
      case "form.processState":
        handleProcessState(elements, value);
        break;
      case "feeds":
        renderFeeds(elements, value);
        break;
      case "posts":
        renderPosts(elements, value);
        break;
      default:
        break;
    }
  });

  return watchedState;
};

export default initView;
