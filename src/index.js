import "bootstrap/dist/css/bootstrap.min.css";
import loadRSS from "./loader.js";
import parseRSS from "./parser.js";
import validate from "./validator.js";
import initView from "./view.js";

const updatePosts = (watchedState) => {
  const promises = watchedState.feeds.map((feed) => {
    const url = watchedState.urls[feed.id];
    return loadRSS(url)
      .then((response) => {
        const { items } = parseRSS(response.data.contents);
        const oldPosts = watchedState.posts.filter(
          (post) => post.feedId === feed.id
        );
        const oldLinks = oldPosts.map((post) => post.link);
        const newPosts = items
          .filter((item) => !oldLinks.includes(item.link))
          .map((item) => ({
            ...item,
            id: Date.now() + Math.random(),
            feedId: feed.id,
          }));

        if (newPosts.length > 0) {
          watchedState.posts.unshift(...newPosts);
        }
      })
      .catch((error) => {
        console.error(`Ошибка обновления фида ${feed.id}:`, error);
      });
  });

  Promise.all(promises).finally(() => {
    setTimeout(() => updatePosts(watchedState), 5000);
  });
};

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

        const feedId = Date.now();
        watchedState.feeds.push({ ...feed, id: feedId });

        const posts = items.map((item) => ({
          ...item,
          id: Date.now() + Math.random(),
          feedId,
        }));

        watchedState.posts.push(...posts);
        watchedState.urls[feedId] = url;

        watchedState.form.processState = "filling";
        e.target.reset();

        setTimeout(() => updatePosts(watchedState), 5000);
      })
      .catch((error) => {
        watchedState.form.processState = "filling";
        watchedState.form.error = error.message;
      });
  });
};

app();
