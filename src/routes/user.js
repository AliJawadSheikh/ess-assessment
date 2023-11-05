const express = require("express");
const { body, validationResult } = require("express-validator");
const jwt = require("jsonwebtoken");
const { PrismaClient } = require("./../../prisma/generated/client");
const bcrypt = require("bcrypt");
const prisma = new PrismaClient();
const router = express.Router();

const secretKey = process.env.SECRET_KEY;

router.post(
  "/signup",
  [
    body("username").isLength({ min: 5 }),
    body("password").isLength({ min: 6 }),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { username, password } = req.body;

    try {
      const hashedPassword = await bcrypt.hash(password, 10); // Hash the password
      const user = await prisma.user.create({
        data: {
          username,
          password: hashedPassword,
        },
      });

      const token = jwt.sign(
        { username: user.username, id: user.id },
        secretKey
      );
      return res.json({
        message: "User registered and logged in successfully",
        user,
        token,
      });
    } catch (error) {
      return res
        .status(500)
        .json({ error: "An error occurred while registering the user" });
    }
  }
);

router.post("/login", async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await prisma.user.findFirst({
      where: {
        username,
      },
    });

    if (!user) {
      return res.status(401).json({ error: "Invalid username or password" });
    }

    const passwordMatch = await bcrypt.compare(password, user.password); // Compare hashed password
    if (!passwordMatch) {
      return res.status(401).json({ error: "Invalid username or password" });
    }

    const token = jwt.sign({ username: user.username, id: user.id }, secretKey);
    return res.json({ message: "User logged in successfully", user, token });
  } catch (error) {
    return res
      .status(500)
      .json({ error: "An error occurred while logging in" });
  }
});

router.post(
  "/forgot-password",
  [body("username").isLength({ min: 5 })],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { username } = req.body;

    try {
      const user = await prisma.user.findFirst({
        where: {
          username,
        },
      });

      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      const resetToken = jwt.sign({ userId: user.id }, secretKey, {
        expiresIn: "1h",
      });
      // Store the reset token and associate it with the user in your database

      return res.json({ message: "Password reset token", resetToken });
    } catch (error) {
      return res
        .status(500)
        .json({ error: "An error occurred while processing your request" });
    }
  }
);

router.post(
  "/reset-password",
  [
    body("token").isLength({ min: 1 }),
    body("newPassword").isLength({ min: 6 }),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { token, newPassword } = req.body;

    try {
      const decoded = jwt.verify(token, secretKey);
      if (decoded.userId) {
        const userId = decoded.userId;

        try {
          const hashedPassword = await bcrypt.hash(newPassword, 10);
          const updatedUser = await prisma.user.update({
            where: {
              id: userId,
            },
            data: {
              password: hashedPassword,
            },
          });

          return res.json({
            message: "Password reset successfully",
            user: updatedUser,
          });
        } catch (updateError) {
          return res
            .status(500)
            .json({ error: "Failed to update user password" });
        }
      } else {
        return res.status(400).json({ error: "Invalid token payload" });
      }
    } catch (error) {
      return res.status(401).json({ error: "Invalid or expired reset token" });
    }
  }
);

module.exports = router;
