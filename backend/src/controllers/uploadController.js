const Tesseract = require('tesseract.js');
const PDFParser = require('pdf2json');
const Transaction = require('../models/Transaction');

exports.uploadReceipt = async (req, res, next) => {
  console.log('uploadController.js: Received request with file:', req.file ? req.file.originalname : 'No file');
  try {
    if (!req.file) return res.status(400).json({ message: 'No file uploaded' });

    let amount = 0;
    let category = 'Other';
    let description = `Uploaded receipt: ${req.file.filename}`;

    if (req.file.mimetype.startsWith('image')) {
      console.log('Processing image file:', req.file.path);
      const { data: { text } } = await Tesseract.recognize(req.file.path, 'eng');
      console.log('Raw OCR text:', text);
      const amountMatch = text.match(/(?:₹|Rs\.?|Total|Amount Due|Grand Total|Total Amount)?\s*[:\-]?\s*(\d{1,3}(?:\.\d{2})?)/i);
      amount = amountMatch ? parseFloat(amountMatch[1]) : 0;
      if (!amountMatch || amount > 10000 || isNaN(amount)) amount = 0; // Reset if no match, too large, or invalid
      console.log('Extracted amount:', amount);
      category = text.toLowerCase().includes('grocery') ? 'Groceries' : 'Other';
      description += ` - ${text.slice(0, 90)}`;
    } else if (req.file.mimetype === 'application/pdf') {
      console.log('Processing PDF file:', req.file.originalname);
      const pdfParser = new PDFParser();
      let parsedData = '';
      pdfParser.on('pdfParser_dataReady', (pdfData) => {
        parsedData = pdfData.Pages.map(page => page.Texts.map(t => decodeURIComponent(t.R[0].T)).join(' ')).join(' ');
        console.log('Raw PDF text:', parsedData);
        const amountMatch = parsedData.match(/(?:₹|Rs\.?|Total|Amount Due|Grand Total|Total Amount)?\s*[:\-]?\s*(\d{1,3}(?:\.\d{2})?)/i);
        amount = amountMatch ? parseFloat(amountMatch[1]) : 0;
        if (!amountMatch || amount > 10000 || isNaN(amount)) amount = 0; // Reset if no match, too large, or invalid
        console.log('Extracted amount:', amount);
        category = parsedData.toLowerCase().includes('grocery') ? 'Groceries' : 'Other';
        description += ` - ${parsedData.slice(0, 90)}`;
      });
      pdfParser.on('error', (err) => {
        console.error('PDF parsing error:', err);
        next(err);
      });
      pdfParser.parseBuffer(req.file.buffer);
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