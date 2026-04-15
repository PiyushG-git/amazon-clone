import express from 'express';
import * as authController from '../controllers/auth.controller.js';
import { registerValidator, loginValidator } from '../validators/auth.validator.js';
import auth from '../middleware/auth.js';

const router = express.Router();

// @route   POST api/auth/register
// @desc    Register user
router.post('/register', registerValidator, authController.register);

// @route   POST api/auth/login
// @desc    Authenticate user & get token
router.post('/login', loginValidator, authController.login);

// @route   GET api/auth/me
// @desc    Get current user
router.get('/me', auth, authController.getMe);

// @route   POST api/auth/logout
// @desc    Logout user & blacklist token
router.post('/logout', auth, authController.logout);

export default router;
