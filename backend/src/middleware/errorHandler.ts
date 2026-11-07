import { Request, Response, NextFunction } from 'express';
import { ENV } from '../config/env.js';

export function errorHandler(
  err: any,
  req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  next: NextFunction
): void {
  // Structured logging for operations
  console.error(`[Error] ${req.method} ${req.path}:`, err?.message || err);

  let statusCode = err.status || err.statusCode || 500;
  let message = err.message || 'Internal Server Error';

  // Handle Prisma-specific database errors safely without leaking schema details
  if (err.code === 'P2002') {
    statusCode = 409;
    const target = Array.isArray(err.meta?.target) ? err.meta.target.join(', ') : err.meta?.target || 'field';
    message = `A record with this ${target} already exists.`;
  } else if (err.code === 'P2025') {
    statusCode = 404;
    message = 'Requested record was not found.';
  } else if (err.code === 'P2003') {
    statusCode = 400;
    message = 'Referenced entity does not exist or relation constraint violated.';
  } else if (err.code === 'P2028' || err.code === 'P2034') {
    statusCode = 409;
    message = 'Transaction conflict occurred due to concurrent modifications. Please retry.';
  }

  // In production, sanitize 500 errors and ensure no internal stack or query details leak
  if (ENV.IS_PRODUCTION) {
    if (statusCode >= 500 || message.includes('prisma') || message.includes('SELECT') || message.includes('UPDATE')) {
      message = 'An unexpected internal server error occurred. Please contact the administrator.';
    }
  }

  res.status(statusCode).json({
    success: false,
    error: message,
    ...(!ENV.IS_PRODUCTION && { stack: err.stack }),
  });
}
