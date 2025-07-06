const Tesseract = require('tesseract.js');
const PDFParser = require('pdf2json');
const Transaction = require('../models/Transaction');

exports.uploadReceipt = async (req, res, next) => {
  try {
    if (!req.file) return res.status(400).json({ message: 'No file uploaded' });

    let amount = 0;
    let category = 'Other';
    let description = `Uploaded receipt: ${req.file.filename}`;

    if (req.file.mimetype.startsWith('image')) {
      const { data: { text } } = await Tesseract.recognize(req.file.path, 'eng');
      const amountMatch = text.match(/\$(\d+\.\d{2})/);
      amount = amountMatch ? parseFloat(amountMatch[1]) : 0; // Default to 0 if no match
      category = text.includes('grocery') ? 'Groceries' : 'Other';
      description += ` - ${text.slice(0, 90)}`;
    } else if (req.file.mimetype === 'application/pdf') {
      const pdfParser = new PDFParser();
      let parsedData = '';
      pdfParser.on('pdfParser_dataReady', (pdfData) => {
        parsedData = pdfData.Pages.map(page => page.Texts.map(t => decodeURIComponent(t.R[0].T)).join(' ')).join(' ');
        const amountMatch = parsedData.match(/\$(\d+\.\d{2})/);
        amount = amountMatch ? parseFloat(amountMatch[1]) : 0; // Default to 0 if no match
        category = parsedData.includes('grocery') ? 'Groceries' : 'Other';
        description += ` - ${parsedData.slice(0, 90)}`;
      });
      pdfParser.on('error', (err) => next(err));
      pdfParser.parseBuffer(req.file.buffer);
      // Wait for parsing to complete (simplified; in practice, use a promise)
      await new Promise(resolve => pdfParser.on('pdfParser_dataError', resolve));
    } else {
      return res.status(400).json({ message: 'Unsupported file type' });
    }

    const userId = req.user.id;
    const transaction = new Transaction({
      user: userId,
      amount,
      date: new Date(),
      category,
      description,
      type: 'expense',
    });
    await transaction.save();
    console.log('uploadController.js: Receipt uploaded and transaction created:', transaction);
    res.status(201).json({ message: 'Receipt uploaded successfully', transaction });
  } catch (error) {
    console.error('uploadController.js: Upload error:', error);
    next(error);
  }
};