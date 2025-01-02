const express = require('express');
const { protect } = require('../middleware/authMiddleware');
const router = express.Router();
const { certificateOnEmail } = require('../controllers/emailCertificate');
 
router.post('/send', protect, certificateOnEmail);

module.exports = router;