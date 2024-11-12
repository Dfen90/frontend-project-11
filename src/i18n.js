import i18next from 'i18next';

const resources = {
  ru: {
    translation: {
      success: 'RSS успешно загружен',
      errors: {
        empty: 'Не должно быть пустым',
        invalid: 'Ссылка должна быть валидным URL',
        exists: 'RSS уже существует',
        notRSS: 'Ресурс не содержит валидный RSS',
        network: 'Ошибка сети'
      },
      buttons: {
        preview: 'Просмотр'
      }
    }
  }
};

i18next.init({
  lng: 'ru',
  debug: false,
  resources,
});

export default i18next;
