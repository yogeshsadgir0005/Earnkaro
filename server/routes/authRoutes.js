const express = require('express');
const Otp = require('../models/Otp');
const router = express.Router();
const { signup, login, resetPassword } = require('../controllers/authController');
const { sendOtp, verifyOtpAndSignup } = require('../controllers/otpController');
const User = require('../models/User');

router.post('/signup', signup);
router.post('/login', login);
router.post('/send-otp', sendOtp);
router.post('/verify-otp', verifyOtpAndSignup);
router.post('/reset-password', resetPassword);




router.post('/check-email', async (req, res) => {
  const { email } = req.body;
  try {
    const user = await User.findOne({ email: email.toLowerCase() });
    if (user) {
      return res.json({ exists: true });
    } else {
      return res.json({ exists: false });
    } 
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

router.post('/verify-reset-otp', async (req, res) => {
  const { email, otp } = req.body;

  try {
    const existingOtp = await Otp.findOne({ email, otp });
    if (!existingOtp) {
      return res.status(400).json({ message: 'Invalid or expired OTP' });
    }

    res.status(200).json({ message: 'OTP verified' });
  } catch (err) {
    console.error('OTP verification error:', err);
    res.status(500).json({ message: 'OTP verification failed', error: err.message });
  }
});
module.exports = router;
