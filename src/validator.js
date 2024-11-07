import * as yup from 'yup';

const schema = yup.string().url('Ссылка должна быть валидным URL').required('URL обязателен');

export default (url, urls) => {
  const urlExists = urls.includes(url);
  if (urlExists) {
    return Promise.reject(new Error('RSS уже существует'));
  }
  return schema.validate(url);
};
