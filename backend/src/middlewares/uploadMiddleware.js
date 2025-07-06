const multer = require('multer');
const fs = require('fs');
const path = require('path');

// Make sure the uploads folder exists
const uploadDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
  console.log('Created uploads directory at:', uploadDir);
} else {
  console.log('Uploads directory exists at:', uploadDir);
}

// Use disk storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    console.log('Setting destination for file:', file.originalname);
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueName = `${Date.now()}-${file.originalname.replace(/\s+/g, '_')}`;
    console.log('Generated filename:', uniqueName);
    cb(null, uniqueName);
  },
});

// Validate file type
const fileFilter = (req, file, cb) => {
  const allowedTypes = ['image/jpeg', 'image/png', 'application/pdf'];
  console.log('Checking file type:', file.mimetype);
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Only JPEG, PNG, and PDF files are allowed'), false);
  }
};

// Export middleware
module.exports = multer({ storage, fileFilter }).single('file');