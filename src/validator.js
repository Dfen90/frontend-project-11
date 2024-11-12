import * as yup from 'yup';
export default (url, urls) => {
  const schema = yup.string()
    .required('Не должно быть пустым')
    .url('Ссылка должна быть валидным URL')
    .notOneOf(urls, 'RSS уже существует');

  return schema.validate(url);
};
