const User = require("../models/user");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// Register User
const registerUser = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        // 1. Check if all fields exist
        if (!name || !email || !password) {
            return res.status(400).json({ message: "Please enter all fields" });
        }

        // 2. Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({ message: "Please enter a valid email address" });
        }

        // 3. Enforce minimum password length
        if (password.length < 6) {
            return res.status(400).json({ message: "Password must be at least 6 characters long" });
        }

        // 4. Normalize email to lowercase
        const normalizedEmail = email.toLowerCase().trim();

        // 5. Check if user already exists
        const userExists = await User.findOne({ email: normalizedEmail });
        if (userExists) {
            return res.status(400).json({ message: "User already exists" });
        }

        // 6. Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // 7. Save user to database
        const user = await User.create({
            name,
            email: normalizedEmail,
            password: hashedPassword,
        });

        // 8. Send success response
        res.status(201).json({
            message: "User registered successfully",
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
            },
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
};

// Login User
const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        // 1. Check if all fields exist
        if (!email || !password) {
            return res.status(400).json({ message: "Please enter email and password" });
        }

        // 2. Normalize email to lowercase
        const normalizedEmail = email.toLowerCase().trim();

        // 3. Find user by normalized email
        const user = await User.findOne({ email: normalizedEmail });
        if (!user) {
            return res.status(400).json({ message: "Invalid email or password" });
        }

        // 4. Compare password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Invalid email or password" });
        }

        // 5. Generate JWT Token
        const token = jwt.sign(
            { id: user._id },
            process.env.JWT_SECRET,
            { expiresIn: "1d" }
        );

        // 6. Send response with token
        res.json({
            message: "Login successful",
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
            },
            token,
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
};

// Get currently logged-in user
const getCurrentUser = async (req, res) => {
    try {

        // req.user comes from protect middleware
        res.status(200).json({
            id: req.user._id,
            name: req.user.name,
            email: req.user.email,
            createdAt: req.user.createdAt,
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: "Server error",
        });
    }
};

// Update User Profile
const updateUserProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const { name, currentPassword, password } = req.body;

        if (name) {
            user.name = name;
        }

        if (password) {
            if (!currentPassword) {
                return res.status(400).json({ message: "Please provide your current password" });
            }
            if (password.length < 6) {
                return res.status(400).json({ message: "Password must be at least 6 characters long" });
            }
            const isMatch = await bcrypt.compare(currentPassword, user.password);
            if (!isMatch) {
                return res.status(400).json({ message: "Incorrect current password" });
            }

            const salt = await bcrypt.genSalt(10);
            user.password = await bcrypt.hash(password, salt);
        }

        const updatedUser = await user.save();

        res.status(200).json({
            id: updatedUser._id,
            name: updatedUser.name,
            email: updatedUser.email,
            createdAt: updatedUser.createdAt,
            message: "Profile updated successfully",
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
};


// Delete User Account
const deleteUserAccount = async (req, res) => {
    try {
        const userId = req.user.id;

        // Delete user's tasks
        const Task = require("../models/task");
        await Task.deleteMany({ user: userId });

        // Delete user
        await User.findByIdAndDelete(userId);

        res.status(200).json({ message: "Account deleted successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
};


module.exports = {
    registerUser,
    loginUser,
    getCurrentUser,
    updateUserProfile,
    deleteUserAccount,
};