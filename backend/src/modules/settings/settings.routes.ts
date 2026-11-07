import { Router } from 'express';
import multer from 'multer';
import path from 'path';
import {
  getSettings,
  updateBusinessProfile,
  updateCredentials,
  uploadLogo,
  purgeData,
} from './settings.controller.js';
import { authenticate, requireRole } from '../../middleware/auth.js';
import { ENV } from '../../config/env.js';

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, ENV.UPLOAD_DIR);
  },
  filename: (req, file, cb) => {
    cb(null, 'logo.png');
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter: (req, file, cb) => {
    const allowed = /jpeg|jpg|png|webp|gif/;
    const ext = allowed.test(path.extname(file.originalname).toLowerCase());
    const mime = allowed.test(file.mimetype);
    if (ext && mime) {
      cb(null, true);
    } else {
      cb(new Error('Only image files (PNG, JPG, WEBP) are allowed.'));
    }
  },
});

export const settingsRouter = Router();

settingsRouter.get('/', authenticate, getSettings);
settingsRouter.get('/profile', authenticate, getSettings);
settingsRouter.put('/profile', authenticate, requireRole('Admin'), updateBusinessProfile);
settingsRouter.put('/credentials', authenticate, requireRole('Admin'), updateCredentials);
settingsRouter.post('/logo', authenticate, requireRole('Admin'), upload.single('logo'), uploadLogo);
settingsRouter.post('/purge', authenticate, requireRole('Admin'), purgeData);
