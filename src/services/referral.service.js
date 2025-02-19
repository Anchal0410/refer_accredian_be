const prisma = require('../config/db.config');
const crypto = require('crypto');

const generateReferralCode = () => {
    return crypto.randomBytes(4).toString('hex').toUpperCase();
};

const createReferral = async (referralData) => {
    try {
        console.log('Starting referral creation with data:', referralData);
        
        const referralCode = generateReferralCode();
        console.log('Generated referral code:', referralCode);
        
        const referral = await prisma.referral.create({
            data: {
                referralCode,
                referrerName: referralData.referrerName,
                referrerEmail: referralData.referrerEmail,
                refereeName: referralData.refereeName,
                refereeEmail: referralData.refereeEmail,
                courseInterest: referralData.courseInterest,
                message: referralData.message,
                status: 'PENDING'
            }
        });
        
        console.log('Created referral:', referral);
        return referral;
    } catch (error) {
        console.error('Failed to create referral:', error);
        throw error;
    }
};

const getReferralByCode = async (referralCode) => {
    try {
        const referral = await prisma.referral.findUnique({
            where: { referralCode }
        });

        if (!referral) {
            throw new Error('Referral not found');
        }

        return referral;
    } catch (error) {
        console.error('Failed to get referral:', error);
        throw error;
    }
};

const updateReferralStatus = async (referralCode, status) => {
    try {
        const referral = await prisma.referral.update({
            where: { referralCode },
            data: { status }
        });

        return referral;
    } catch (error) {
        console.error('Failed to update referral:', error);
        throw error;
    }
};

module.exports = {
    createReferral,
    getReferralByCode,
    updateReferralStatus
};
