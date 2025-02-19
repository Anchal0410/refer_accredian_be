const { sendReferralEmail } = require('./services/mail.service');

const testEmailService = async () => {
  try {
    console.log('Testing email service...');
    
    const testData = {
      referralCode: 'TEST123',
      referrerName: 'John Doe',
      referrerEmail: 'john@example.com',
      refereeName: 'Jane Smith',
      refereeEmail: 'jane@example.com',
      courseInterest: 'Web Development'
    };

    const result = await sendReferralEmail(testData);
    
    console.log('Emails sent successfully!');
    console.log('Check the preview URLs above to view the test emails');
    
  } catch (error) {
    console.error('Error testing email service:', error);
  }
};

testEmailService();
