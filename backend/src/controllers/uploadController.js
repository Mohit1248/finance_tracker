const Tesseract = require('tesseract.js');
const PDFParser = require('pdf2json');

exports.uploadReceipt = async (req, res, next) => {
  try {
    if (!req.file) return res.status(400).json({ message: 'No file uploaded' });

    if (req.file.mimetype.startsWith('image')) {
      const { data: { text } } = await Tesseract.recognize(req.file.path, 'eng');
      const amountMatch = text.match(/\$(\d+\.\d{2})/);
      const amount = amountMatch ? parseFloat(amountMatch[1]) : null;
      const category = text.includes('grocery') ? 'Groceries' : 'Other';

      if (!amount) return res.status(400).json({ message: 'Could not parse amount' });

      res.json({ amount, category, description: text.slice(0, 100) });
    } else if (req.file.mimetype === 'application/pdf') {
      const pdfParser = new PDFParser();
      let parsedData = '';
      pdfParser.on('pdfParser_dataReady', (pdfData) => {
        parsedData = pdfData.Pages.map(page => page.Texts.map(t => decodeURIComponent(t.R[0].T)).join(' ')).join(' ');
        const amountMatch = parsedData.match(/\$(\d+\.\d{2})/);
        const amount = amountMatch ? parseFloat(amountMatch[1]) : null;
        const category = parsedData.includes('grocery') ? 'Groceries' : 'Other';

        if (!amount) return res.status(400).json({ message: 'Could not parse amount' });
        res.json({ amount, category, description: parsedData.slice(0, 100) });
      });
      pdfParser.on('error', (err) => next(err));
      pdfParser.parseBuffer(req.file.buffer);
    } else {
      res.status(400).json({ message: 'Unsupported file type' });
    }
  } catch (error) {
    next(error);
  }
};