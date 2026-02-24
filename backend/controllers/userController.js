const User = require('../models/User');
const sendEmail = require('../utils/sendEmail');

// @desc    Get all users (team members)
// @route   GET /api/users
// @access  Public
const getUsers = async (req, res) => {
    try {
        const users = await User.find().sort({ createdAt: -1 });
        const formattedUsers = users.map(user => {
            const u = user.toObject();
            u.id = u._id.toString();
            return u;
        });
        res.status(200).json(formattedUsers);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Create a new user
// @route   POST /api/users
// @access  Public
const createUser = async (req, res) => {
    try {
        const user = new User(req.body);
        const savedUser = await user.save();

        const u = savedUser.toObject();
        u.id = u._id.toString();

        // Send invitation email if the user has an email and password
        if (req.body.email && req.body.password && req.body.loginId) {
            try {
                const emailHtml = `
                    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #eaeaeb; border-radius: 8px; overflow: hidden;">
                        <div style="background-color: #2563eb; padding: 20px; text-align: center;">
                            <h2 style="color: white; margin: 0;">Welcome to TaskFlow!</h2>
                        </div>
                        <div style="padding: 20px; background-color: #ffffff;">
                            <p style="font-size: 16px; color: #333;">Hi ${req.body.name},</p>
                            <p style="font-size: 16px; color: #333;">You have been invited to join the team on TaskFlow. Here are your login credentials:</p>
                            <div style="background-color: #f3f4f6; padding: 15px; border-radius: 6px; margin: 20px 0;">
                                <p style="margin: 0 0 10px 0;"><strong>Login ID:</strong> ${req.body.loginId}</p>
                                <p style="margin: 0;"><strong>Password:</strong> ${req.body.password}</p>
                            </div>
                            <p style="font-size: 16px; color: #333;">You can log in to the dashboard using these credentials.</p>
                            <a href="http://localhost:5173/login" style="display: inline-block; background-color: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold; margin-top: 10px;">Go to Login</a>
                        </div>
                        <div style="background-color: #f9fafb; padding: 15px; text-align: center; font-size: 12px; color: #6b7280;">
                            <p style="margin: 0;">&copy; ${new Date().getFullYear()} TaskFlow. All rights reserved.</p>
                        </div>
                    </div>
                `;

                await sendEmail({
                    to: req.body.email,
                    subject: 'TaskFlow - Team Invitation & Login Credentials',
                    html: emailHtml,
                });
                console.log(`Invitation email sent to ${req.body.email}`);
            } catch (emailError) {
                console.error(`Failed to send invitation email to ${req.body.email}:`, emailError);
                // We do not fail the user creation if email fails
            }
        }

        res.status(201).json(u);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// @desc    Update a user
// @route   PUT /api/users/:id
// @access  Public
const updateUser = async (req, res) => {
    try {
        const user = await User.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true,
        });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        const u = user.toObject();
        u.id = u._id.toString();
        res.status(200).json(u);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// @desc    Delete a user
// @route   DELETE /api/users/:id
// @access  Public
const deleteUser = async (req, res) => {
    try {
        const user = await User.findByIdAndDelete(req.params.id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json({ id: req.params.id, message: 'User removed' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Authenticate user login
// @route   POST /api/users/login
// @access  Public
const loginUser = async (req, res) => {
    try {
        const { loginId, password } = req.body;

        // In a real application, you should hash the password!
        const user = await User.findOne({ loginId });

        if (!user) {
            return res.status(401).json({ message: 'Invalid Login ID or Password' });
        }

        if (user.password !== password) {
            return res.status(401).json({ message: 'Invalid Login ID or Password' });
        }

        const u = user.toObject();
        u.id = u._id.toString();

        // Remove password from response
        delete u.password;

        res.status(200).json(u);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getUsers,
    createUser,
    updateUser,
    deleteUser,
    loginUser,
};
