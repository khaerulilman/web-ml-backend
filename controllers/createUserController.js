const { prisma } = require("../config/db");
const bcrypt = require("bcrypt");
const { nanoid } = require("nanoid");

const createUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res
        .status(400)
        .json({ message: "Name, Email, and Password are required" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    // Generate nanoid untuk ID user
    const userId = `user-${nanoid()}`;

    const user = await prisma.users.create({
      data: {
        id: userId,
        name,
        email,
        password: hashedPassword,
      },
    });

    // Hapus password dari response
    const { password: _, ...userWithoutPassword } = user;

    res.status(201).json({
      message: "User created successfully",
      user: userWithoutPassword,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error creating user", error: error.message });
  }
};

module.exports = { createUser };
