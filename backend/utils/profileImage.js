const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('./cloudinary');

// Configure CloudinaryStorage for images
const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'e-learning/avatars',
    allowed_formats: ['jpg', 'jpeg', 'png'], 
    resource_type: 'image', 
    transformation: [
      { width: 300, height: 300, crop: 'fill' }, 
    ],
  },
});

// Initialize multer with the updated storage configuration
const uploadImage = multer({ storage });

module.exports = uploadImage;
