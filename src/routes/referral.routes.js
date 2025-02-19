const express = require('express');
const router = express.Router();
const referralController = require('../controllers/referral.controller');

// Create new referral
router.post('/', referralController.createReferral);

// Get referral status
router.get('/:referralCode', referralController.getReferralStatus);

// Update referral status
router.patch('/:referralCode', referralController.updateReferralStatus);

module.exports = router;