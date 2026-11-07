import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { User } from '../../models/User.js';
import { Setting } from '../../models/Setting.js';
import { ENV } from '../../config/env.js';

export async function login(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      res.status(400).json({ success: false, error: 'Username and password are required.' });
      return;
    }

    // 1. Check existing User record in DB
    let user = await User.findOne({ username: username.trim() });
    let authenticated = false;
    let role: 'Admin' | 'User' = 'User';

    if (user) {
      authenticated = await user.comparePassword(password);
      role = user.role;
    } else {
      // 2. Fallback to app_settings or defaults
      const adminUserSetting = await Setting.findOne({ key: 'admin_username' });
      const adminPassSetting = await Setting.findOne({ key: 'admin_password' });
      const userUserSetting = await Setting.findOne({ key: 'user_username' });
      const userPassSetting = await Setting.findOne({ key: 'user_password' });

      const adminUser = adminUserSetting?.value || 'Isuru@6800';
      const adminPass = adminPassSetting?.value || 'Isuru@service';
      const userUser = userUserSetting?.value || 'User@123';
      const userPass = userPassSetting?.value || 'User@service';

      if (username === adminUser && password === adminPass) {
        authenticated = true;
        role = 'Admin';
        // Auto-seed Admin in User model
        const hash = await bcrypt.hash(password, 10);
        user = await User.create({
          username: adminUser,
          passwordHash: hash,
          role: 'Admin',
          fullName: 'Administrator',
        });
      } else if (username === userUser && password === userPass) {
        authenticated = true;
        role = 'User';
        // Auto-seed User in User model
        const hash = await bcrypt.hash(password, 10);
        user = await User.create({
          username: userUser,
          passwordHash: hash,
          role: 'User',
          fullName: 'Service Staff',
        });
      }
    }

    if (!authenticated || !user) {
      res.status(401).json({ success: false, error: 'Invalid username or password.' });
      return;
    }

    // Generate JWT
    const token = jwt.sign(
      { userId: user._id.toString(), username: user.username, role: user.role },
      ENV.JWT_SECRET,
      { expiresIn: '7d' }
    );

    // Set HTTP-only cookie
    res.cookie('isuru_token', token, {
      httpOnly: true,
      secure: ENV.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    res.json({
      success: true,
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        username: user.username,
        role: user.role,
        fullName: user.fullName,
      },
    });
  } catch (error) {
    next(error);
  }
}

export function logout(req: Request, res: Response): void {
  res.clearCookie('isuru_token');
  res.json({ success: true, message: 'Logged out successfully.' });
}

export async function getMe(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, error: 'Not authenticated.' });
      return;
    }

    const user = await User.findById(req.user.userId).select('-passwordHash');
    if (!user) {
      res.status(404).json({ success: false, error: 'User not found.' });
      return;
    }

    res.json({
      success: true,
      user: {
        id: user._id,
        username: user.username,
        role: user.role,
        fullName: user.fullName,
      },
    });
  } catch (error) {
    next(error);
  }
}
