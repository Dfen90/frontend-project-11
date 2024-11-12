export default (data) => {
  try {
    const parser = new DOMParser();
    const doc = parser.parseFromString(data, 'application/xml');
    
    const errorNode = doc.querySelector('parsererror');
    if (errorNode) {
      throw new Error('errors.notRSS');
    }

    const feed = {
      title: doc.querySelector('channel > title').textContent.trim(),
      description: doc.querySelector('channel > description').textContent.trim(),
    };

    const items = Array.from(doc.querySelectorAll('item')).map((item) => ({
      title: item.querySelector('title').textContent.trim(),
      link: item.querySelector('link').textContent.trim(),
      description: item.querySelector('description').textContent.trim(),
    }));

    return { feed, items };
  } catch (e) {
    throw new Error('errors.notRSS');
  }
};
