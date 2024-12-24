const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('./cloudinary');

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'e-learning/videos',
    resource_type: 'video',
  },
});

const upload = multer({ storage });

module.exports = upload;
