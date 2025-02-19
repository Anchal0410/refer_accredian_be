const referralService = require('../services/referral.service');
const { sendReferralEmail } = require('../services/mail.service');  // Add this import

const createReferral = async (req, res) => {
    try {
      console.log('Received referral request:', req.body);
      
      const {
        referrerName,
        referrerEmail,
        refereeName,
        refereeEmail,
        courseInterest,
      } = req.body;
  
      // Create referral in database
      console.log('Creating referral in database...');
      const referral = await referralService.createReferral({
        referrerName,
        referrerEmail,
        refereeName,
        refereeEmail,
        courseInterest
      });
      console.log('Referral created:', referral);
  
      // Send emails
      console.log('Attempting to send emails...');
      try {
        const emailResult = await sendReferralEmail({
          referralCode: referral.referralCode,
          referrerName,
          referrerEmail,
          refereeName,
          refereeEmail,
          courseInterest
        });
        console.log('Email result:', emailResult);
      } catch (emailError) {
        console.error('Error sending email:', emailError);
        // Still return success since referral was created
        return res.status(201).json({
          success: true,
          data: referral,
          emailError: 'Email could not be sent, but referral was created'
        });
      }
  
      res.status(201).json({
        success: true,
        data: referral
      });
    } catch (error) {
      console.error('Error in createReferral:', error);
      res.status(500).json({
        error: error,
        success: false,
        message: 'Error creating referral'
      });
    }
  };  


// Get referral status
const getReferralStatus = async (req, res) => {
    try {
        const { referralCode } = req.params;
        const referral = await referralService.getReferralByCode(referralCode);
        
        res.status(200).json({
            success: true,
            data: referral
        });
    } catch (error) {
        res.status(404).json({
            success: false,
            message: 'Referral not found'
        });
    }
};

// Update referral status
const updateReferralStatus = async (req, res) => {
    try {
        const { referralCode } = req.params;
        const { status } = req.body;
        
        const referral = await referralService.updateReferralStatus(referralCode, status);
        
        res.status(200).json({
            success: true,
            data: referral
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error updating referral status'
        });
    }
};

module.exports = {
    createReferral,
    getReferralStatus,
    updateReferralStatus
};