const PDFParser = require('pdf2json');

module.exports = async (fileBuffer) => {
  return new Promise((resolve, reject) => {
    const pdfParser = new PDFParser();
    let parsedData = '';
    pdfParser.on('pdfParser_dataReady', (pdfData) => {
      parsedData = pdfData.Pages.map(page => page.Texts.map(t => decodeURIComponent(t.R[0].T)).join(' ')).join(' ');
      const amountMatch = parsedData.match(/\$(\d+\.\d{2})/);
      const amount = amountMatch ? parseFloat(amountMatch[1]) : null;
      const category = parsedData.includes('grocery') ? 'Groceries' : 'Other';
      resolve({ amount, category, description: parsedData.slice(0, 100) });
    });
    pdfParser.on('error', (err) => reject(err));
    pdfParser.parseBuffer(fileBuffer);
  });
};