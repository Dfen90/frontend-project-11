import "bootstrap/dist/css/bootstrap.min.css";
import loadRSS from "./loader.js";
import parseRSS from "./parser.js";
import validate from "./validator.js";
import initView from "./view.js";

const app = () => {
  const state = {
    form: {
      processState: "filling",
      error: null,
    },
    feeds: [],
    posts: [],
    urls: [],
  };

  const elements = {
    form: document.querySelector(".rss-form"),
    input: document.querySelector(".rss-form input"),
    feedback: document.querySelector(".feedback"),
    submit: document.querySelector(".rss-form button"),
    feedsContainer: document.querySelector(".feeds"),
    postsContainer: document.querySelector(".posts"),
  };

  const watchedState = initView(state, elements);

  elements.form.addEventListener("submit", (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const url = formData.get("url").trim();

    watchedState.form.processState = "sending";
    watchedState.form.error = null;

    validate(url, state.urls)
      .then(() => loadRSS(url))
      .then((response) => {
        const { feed, items } = parseRSS(response.data.contents);

        watchedState.feeds.push({ ...feed, id: Date.now() });

        const posts = items.map((item) => ({
          ...item,
          id: Date.now() + Math.random(),
          feedId: feed.id,
        }));

        watchedState.posts.push(...posts);
        watchedState.urls.push(url);

        watchedState.form.processState = "filling";
        e.target.reset();
      })
      .catch((error) => {
        watchedState.form.processState = "filling";
        watchedState.form.error = error.message;
      });
  });
};

app();
