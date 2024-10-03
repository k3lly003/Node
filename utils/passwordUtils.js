import bcrypt from 'bcrypt';

// Hash a password
const hashPassword = async (password) => {
  return await bcrypt.hash(password, 12);
};

// Compare passwords
const comparePassword = async (inputPassword, hashedPassword) => {
  return await bcrypt.compare(inputPassword, hashedPassword);
};

const passwordUtils = {
  hashPassword,
  comparePassword,
}
export default passwordUtils;