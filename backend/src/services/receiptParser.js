const Tesseract = require('tesseract.js');

module.exports = async (filePath) => {
  const { data: { text } } = await Tesseract.recognize(filePath, 'eng');
  const amountMatch = text.match(/\$(\d+\.\d{2})/);
  const amount = amountMatch ? parseFloat(amountMatch[1]) : null;
  const category = text.includes('grocery') ? 'Groceries' : 'Other';
  return { amount, category, description: text.slice(0, 100) };
};