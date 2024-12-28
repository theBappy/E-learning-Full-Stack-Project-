const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('./cloudinary');

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'e-learning/videos',
    allowed_formats: ['mp4', 'mov', 'avi'],
    resource_type: 'video',
  },
});

const upload = multer({ storage });

module.exports = upload;
