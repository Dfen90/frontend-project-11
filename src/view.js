import onChange from "on-change";
import i18n from "./i18n.js";

const renderFeeds = (elements, feeds) => {
  const { feedsContainer } = elements;
  const feedsList = feeds
    .map((feed) => `
    <div class="card mb-3">
      <div class="card-body">
        <h2 class="card-title h4">${feed.title}</h2>
        <p class="card-text">${feed.description}</p>
      </div>
    </div>
  `).join("");

  feedsContainer.innerHTML = feedsList;
};

const renderPosts = (elements, { posts, uiState }) => {
  const { postsContainer } = elements;
  const postsList = posts
    .map((post) => {
      const isVisited = uiState.visitedPostIds.has(post.id);
      const fontWeight = isVisited ? "fw-normal" : "fw-bold";

      return `
      <div class="card mb-2">
        <div class="card-body d-flex justify-content-between align-items-center">
          <a href="${post.link}" class="${fontWeight}" data-id="${post.id}" target="_blank">${post.title}</a>
          <button type="button" class="btn btn-primary btn-sm" data-id="${post.id}" data-bs-toggle="modal" data-bs-target="#modal">
            ${i18n.t("buttons.preview")}
          </button>
        </div>
      </div>
    `;
    })
    .join("");

  postsContainer.innerHTML = postsList;
};

const renderModal = (elements, { posts, uiState }) => {
  const { modal } = elements;
  const post = posts.find(({ id }) => id === uiState.modalPostId);
  if (!post) return;

  const titleEl = modal.querySelector(".modal-title");
  const bodyEl = modal.querySelector(".modal-body");
  const linkEl = modal.querySelector(".full-article");

  titleEl.textContent = post.title;
  bodyEl.textContent = post.description;
  linkEl.href = post.link;
};

const renderErrors = (elements, error) => {
  const { input, feedback } = elements;

  if (error) {
    input.classList.add("is-invalid");
    feedback.classList.add("text-danger");
    feedback.classList.remove("text-success");
    feedback.textContent = i18n.t(error);
  } else {
    input.classList.remove("is-invalid");
    feedback.classList.remove("text-danger");
  }
};

const renderSuccess = (elements, success) => {
  const { feedback } = elements;

  if (success) {
    feedback.classList.remove("text-danger");
    feedback.classList.add("text-success");
    feedback.textContent = i18n.t(success);
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

export default (state, elements) => {
  const watchedState = onChange(state, (path, value) => {
    switch (path) {
      case "form.error":
        renderErrors(elements, value);
        break;
      case "form.success":
        renderSuccess(elements, value);
        break;
      case "form.processState":
        handleProcessState(elements, value);
        break;
      case "feeds":
        renderFeeds(elements, value);
        break;
      case "posts":
      case "uiState.visitedPostIds":
        renderPosts(elements, state);
        break;
      case "uiState.modalPostId":
        renderModal(elements, state);
        break;
      default:
        break;
    }
  });

  return watchedState;
};
