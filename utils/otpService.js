import crypto from 'crypto';

// Generate OTP
const generateOTP = () => {
  return crypto.randomBytes(3).toString('hex'); // Generates a 6-digit OTP
};

// Verify OTP
const verifyOTP = (inputOTP, storedOTP) => {
  return inputOTP === storedOTP;
};

const otpService = {
  generateOTP,
  verifyOTP,
}
export default otpService;
