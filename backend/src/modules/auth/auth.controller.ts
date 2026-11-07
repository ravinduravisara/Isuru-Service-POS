import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { prisma } from '../../config/prisma.js';
import { ENV } from '../../config/env.js';

export async function login(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      res.status(400).json({ success: false, error: 'Username and password are required.' });
      return;
    }

    // 1. Check existing User record in DB
    let user = await prisma.user.findUnique({
      where: { username: username.trim() },
    });

    let authenticated = false;
    let role = 'User';

    if (user) {
      authenticated = await bcrypt.compare(password, user.passwordHash);
      role = user.role;
    } else {
      // 2. Fallback to app_settings or defaults
      const settings = await prisma.setting.findMany({
        where: {
          key: {
            in: ['admin_username', 'admin_password', 'user_username', 'user_password'],
          },
        },
      });

      const setMap = new Map<string, string>();
      settings.forEach((s) => setMap.set(s.key, s.value));

      const adminUser = setMap.get('admin_username') || 'Isuru@6800';
      const adminPass = setMap.get('admin_password') || 'Isuru@service';
      const userUser = setMap.get('user_username') || 'User@123';
      const userPass = setMap.get('user_password') || 'User@service';

      if (username === adminUser && password === adminPass) {
        authenticated = true;
        role = 'Admin';
        const hash = await bcrypt.hash(password, 10);
        user = await prisma.user.create({
          data: {
            username: adminUser,
            passwordHash: hash,
            role: 'Admin',
            fullName: 'Administrator',
          },
        });
      } else if (username === userUser && password === userPass) {
        authenticated = true;
        role = 'User';
        const hash = await bcrypt.hash(password, 10);
        user = await prisma.user.create({
          data: {
            username: userUser,
            passwordHash: hash,
            role: 'User',
            fullName: 'Service Staff',
          },
        });
      }
    }

    if (!authenticated || !user) {
      res.status(401).json({ success: false, error: 'Invalid username or password.' });
      return;
    }

    // Generate JWT
    const token = jwt.sign(
      { userId: user.id, username: user.username, role: user.role },
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
        id: user.id,
        _id: user.id,
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

    const user = await prisma.user.findUnique({
      where: { id: req.user.userId },
      select: {
        id: true,
        username: true,
        role: true,
        fullName: true,
      },
    });

    if (!user) {
      res.status(404).json({ success: false, error: 'User not found.' });
      return;
    }

    res.json({
      success: true,
      user: {
        id: user.id,
        _id: user.id,
        username: user.username,
        role: user.role,
        fullName: user.fullName,
      },
    });
  } catch (error) {
    next(error);
  }
}
