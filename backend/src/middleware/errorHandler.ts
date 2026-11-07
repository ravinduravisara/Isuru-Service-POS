import { Request, Response, NextFunction } from 'express';

export function errorHandler(
  err: any,
  req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  next: NextFunction
): void {
  // Structured logging
  console.error(`[Error] ${req.method} ${req.path}:`, err?.message || err);

  let statusCode = err.status || err.statusCode || 500;
  let message = err.message || 'Internal Server Error';

  // Handle Prisma-specific database errors safely
  if (err.code === 'P2002') {
    statusCode = 409;
    const target = Array.isArray(err.meta?.target) ? err.meta.target.join(', ') : err.meta?.target || 'field';
    message = `A record with this ${target} already exists.`;
  } else if (err.code === 'P2025') {
    statusCode = 404;
    message = 'Requested record was not found.';
  } else if (err.code === 'P2003') {
    statusCode = 400;
    message = 'Foreign key constraint violated.';
  }

  // Prevent leaking internal stack traces in production
  const isDev = process.env.NODE_ENV === 'development';
  if (!isDev && statusCode === 500) {
    message = 'An unexpected internal server error occurred. Please contact administrator.';
  }

  res.status(statusCode).json({
    success: false,
    error: message,
    ...(isDev && { stack: err.stack }),
  });
}
