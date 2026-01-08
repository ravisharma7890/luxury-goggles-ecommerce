import db from "../config/db.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

// REGISTER
export const registerUser = async (req, res) => {
    console.log("REGISTER HIT"); // 👈 ADD
  try {
    const { name, email, password, role } = req.body;

    const [exists] = await db.query(
      "SELECT id FROM users WHERE email = ?",
      [email]
    );

    if (exists.length > 0) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await db.query(
      "INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)",
      [name, email, hashedPassword, role || "user"]
    );

    res.status(201).json({ message: "User registered successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// LOGIN
export const loginUser = async (req, res) => {
  console.log("LOGIN HIT"); // 👈 ADD

  try {
    const { email, password } = req.body;
    console.log("EMAIL:", email);

    const [rows] = await db.query(
      "SELECT * FROM users WHERE email = ?",
      [email]
    );

    console.log("USER QUERY DONE"); // 👈 ADD

    if (rows.length === 0) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const user = rows[0];

    const isMatch = await bcrypt.compare(password, user.password);
    console.log("PASSWORD CHECK DONE");

    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    console.log("TOKEN GENERATED");

    res.json({
      token,
      user: {
        id: user.id,
        role: user.role
      }
    });

  } catch (err) {
    console.error("LOGIN ERROR:", err.message);
    res.status(500).json({ message: err.message });
  }
};
