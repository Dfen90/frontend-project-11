import 'bootstrap/dist/css/bootstrap.min.css';
import validate from './validator.js';
import initView from './view.js';

const app = () => {
  const state = {
    form: {
      processState: 'filling',
      error: null,
    },
    urls: [],
  };

  const elements = {
    form: document.querySelector('.rss-form'),
    input: document.querySelector('.rss-form input'),
    feedback: document.querySelector('.feedback'),
    submit: document.querySelector('.rss-form button'),
  };

  const watchedState = initView(state, elements);

  elements.form.addEventListener('submit', (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const url = formData.get('url').trim();

    watchedState.form.processState = 'sending';
    watchedState.form.error = null;

    validate(url, state.urls)
      .then(() => {
        watchedState.urls.push(url);
        watchedState.form.processState = 'filling';
        elements.form.reset();
        elements.input.focus();
      })
      .catch((error) => {
        watchedState.form.processState = 'filling';
        watchedState.form.error = error.message;
      });
  });
};

app();
