const cloudinary = require('cloudinary').v2;

try {
  const sig = cloudinary.utils.api_sign_request({
    folder: 'eatro_kyc',
    timestamp: 1787585936,
    type: 'private'
  }, '<ENTER_YOUR_API_SECRET_HERE>');
  console.log("Sig with placeholder:", sig);
} catch (e) {}
