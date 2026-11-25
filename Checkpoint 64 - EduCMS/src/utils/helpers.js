const slugify = require('slugify');

const generateSlug = (text) =>
  slugify(text, { lower: true, strict: true, remove: /[*+~.()'"!:@]/g });

const calculateReadingTime = (text = '') => {
  const words = text.trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.ceil(words / 200));
};

const extractExcerpt = (content = '', length = 180) => {
  const plain = content.replace(/<[^>]*>/g, '').trim();
  return plain.length <= length ? plain : `${plain.slice(0, length).trim()}...`;
};

module.exports = { generateSlug, calculateReadingTime, extractExcerpt };
