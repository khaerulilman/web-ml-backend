const userRepository = require("../repositories/userRepository");
const { verifyPassword } = require("../utils/passwordUtils");
const { generateToken } = require("../utils/tokenUtils");

const loginService = async (email, password) => {
  if (!email || !password) {
    throw new Error("Email and password are required");
  }

  const user = await userRepository.findUserByEmail(email);

  if (!user) {
    throw new Error("Invalid email or password");
  }

  const isPasswordValid = await verifyPassword(password, user.password);

  if (!isPasswordValid) {
    throw new Error("Invalid email or password");
  }

  const token = generateToken({
    userId: user.id,
    email: user.email,
  });

  return {
    error: false,
    message: "success",
    loginResult: {
      userId: user.id,
      name: user.name,
      token,
    },
  };
};

module.exports = { loginService };
