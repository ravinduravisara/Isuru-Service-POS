import { Router } from 'express';
import { login, logout, getMe, setupInitialAdmin } from './auth.controller.js';
import { authenticate } from '../../middleware/auth.js';
import { authRateLimiter } from '../../middleware/rateLimiter.js';

export const authRouter = Router();

authRouter.post('/setup', authRateLimiter, setupInitialAdmin);
authRouter.post('/login', authRateLimiter, login);
authRouter.post('/logout', logout);
authRouter.get('/me', authenticate, getMe);
