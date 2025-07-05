const express = require('express');
const { uploadReceipt } = require('../controllers/uploadController');
const authMiddleware = require('../middlewares/authMiddleware');
const uploadMiddleware = require('../middlewares/uploadMiddleware');
const router = express.Router();

router.use(authMiddleware);
router.post('/receipt', uploadMiddleware, uploadReceipt);

module.exports = router;