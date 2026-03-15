const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const userModel = require("../models/User");

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "7d"
  });
};


// register controller
const createUser = async (req, res) => {
  try {

    const { name, email, password } = req.body;

    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);
    const user = await userModel.create({
      name,
      email,
      password: hash
    });
    
    console.log(hash);
    res.json(user);

  } catch (error) {

    res.status(500).json({ message: error.message });

  }
};


// login controller
const loginUser = async (req, res) => {
  try {

    const { email, password } = req.body;

    const user = await userModel.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: "Invalid Email or Password" });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ message: "Invalid email or password" });
    }
    
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      token: generateToken(user._id)
    });

  } catch (error) {

    res.status(500).json({ message: error.message });

  }
};

// profile
const getUserProfile = async (req, res) => {
  try {

    const user = await userModel.findById(req.user._id).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(user);

  } catch (error) {

    res.status(500).json({ message: error.message });

  }
};
// Update profile
const updateProfile = async (req, res) => {
  try {
    const { name, currentPassword, newPassword } = req.body;
    const user = await userModel.findById(req.user._id);

    if (!user) return res.status(404).json({ message: "User not found" });

    // Update name if provided
    if (name) user.name = name;

    // Update password if both provided
    if (currentPassword && newPassword) {
      const isMatch = await bcrypt.compare(currentPassword, user.password);
      if (!isMatch)
        return res.status(400).json({ message: "Current password is incorrect" });
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(newPassword, salt);
    }

    await user.save();

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Add to exports
module.exports = { createUser, loginUser, getUserProfile, updateProfile };


