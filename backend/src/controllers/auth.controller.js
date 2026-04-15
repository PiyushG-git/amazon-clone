import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import redis from '../config/cache.js';

const cookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 5 * 60 * 60 * 1000 // 5 hours in ms
};

export const register = async (req, res) => {
    const { name, email, password } = req.body;
    try {
        const userExists = await User.findByEmail(email);
        if (userExists) {
            return res.status(400).json({ message: 'User already exists' });
        }

        const salt = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash(password, salt);

        const newUser = await User.create(name, email, passwordHash);

        const payload = { user: { id: newUser.id } };
        jwt.sign(payload, process.env.JWT_SECRET || 'secret123', { expiresIn: '5h' }, (err, token) => {
            if (err) throw err;
            res.cookie('token', token, cookieOptions);
            res.json({ token, user: newUser });
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

export const login = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findByEmail(email);
        if (!user) {
            return res.status(400).json({ message: 'Invalid Credentials' });
        }

        const isMatch = await bcrypt.compare(password, user.password_hash);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid Credentials' });
        }

        const payload = { user: { id: user.id } };
        jwt.sign(payload, process.env.JWT_SECRET || 'secret123', { expiresIn: '5h' }, (err, token) => {
            if (err) throw err;
            res.cookie('token', token, cookieOptions);
            res.json({ token, user: { id: user.id, name: user.name, email: user.email } });
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

export const logout = async (req, res) => {
    try {
        const token = req.token; // From auth middleware
        if (token) {
            // Blacklist for the remaining time (or max token age)
            await redis.set(token, 'blacklisted', 'EX', 5 * 60 * 60);
        }
        res.clearCookie('token');
        res.json({ message: 'Logged out successfully' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

export const getMe = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        res.json(user);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};
