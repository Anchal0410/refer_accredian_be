const crypto = require('crypto');

 const generateReferralCode = () => {
  // Generate a random 8-character code
  return crypto.randomBytes(4).toString('hex').toUpperCase();
};

 const validateEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
};