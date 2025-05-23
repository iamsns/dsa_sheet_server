const User = require('../models/authModel');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.login = async (req, res, next) => {
    const { name, email, password } = req.body;
    if (!email || !password) {
        return res.status(401).json({
            message: 'Please provide valid credentials',
        });
    }
    try {
        let user = await User.findOne({ email })
        if (!user) {
            if (!name) {
                return res.status(401).json({ message: 'User not found. Please register.' });
            }
            const hashedPassword = await bcrypt.hash(password, 10);
            user = new User({ name, email, password: hashedPassword });
            await user.save();
        } else {
            const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch) {
                return res.status(401).json({ message: 'Invalid password' });
            }
        }

        const token = jwt.sign(
            { userId: user._id, email: user.email },
            process.env.JWT_SECRET || 'mysecretkey',
            { expiresIn: '1d' }
        );

        res.status(200).json({
            message: 'Login successful',
            token,
            user: {
                email: user.email,
                name: user.name 
            },
        });

    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};