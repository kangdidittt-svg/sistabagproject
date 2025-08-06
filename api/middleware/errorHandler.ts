import { Request, Response, NextFunction } from 'express';
import mongoose from 'mongoose';

export interface ApiError extends Error {
  statusCode?: number;
  isOperational?: boolean;
}

/**
 * Custom error class for API errors
 */
export class AppError extends Error implements ApiError {
  statusCode: number;
  isOperational: boolean;

  constructor(message: string, statusCode: number = 500) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);
  }
}

/**
 * Handle Mongoose validation errors
 */
const handleValidationError = (error: mongoose.Error.ValidationError): AppError => {
  const errors = Object.values(error.errors).map(err => err.message);
  const message = `Validation Error: ${errors.join('. ')}`;
  return new AppError(message, 400);
};

/**
 * Handle Mongoose duplicate key errors
 */
const handleDuplicateKeyError = (error: any): AppError => {
  const field = Object.keys(error.keyValue)[0];
  const value = error.keyValue[field];
  const message = `Duplicate value for field '${field}': '${value}'. Please use another value.`;
  return new AppError(message, 400);
};

/**
 * Handle Mongoose cast errors
 */
const handleCastError = (error: mongoose.Error.CastError): AppError => {
  const message = `Invalid ${error.path}: ${error.value}`;
  return new AppError(message, 400);
};

/**
 * Handle JWT errors
 */
const handleJWTError = (): AppError => {
  return new AppError('Invalid token. Please log in again.', 401);
};

const handleJWTExpiredError = (): AppError => {
  return new AppError('Your token has expired. Please log in again.', 401);
};

/**
 * Send error response in development
 */
const sendErrorDev = (err: ApiError, res: Response): void => {
  res.status(err.statusCode || 500).json({
    success: false,
    error: err.message,
    stack: err.stack,
    details: err
  });
};

/**
 * Send error response in production
 */
const sendErrorProd = (err: ApiError, res: Response): void => {
  // Operational, trusted error: send message to client
  if (err.isOperational) {
    res.status(err.statusCode || 500).json({
      success: false,
      error: err.message
    });
  } else {
    // Programming or other unknown error: don't leak error details
    console.error('ERROR:', err);
    res.status(500).json({
      success: false,
      error: 'Something went wrong!'
    });
  }
};

/**
 * Global error handling middleware
 */
export const globalErrorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  let error = { ...err };
  error.message = err.message;
  error.statusCode = err.statusCode || 500;

  // Log error
  console.error('Error:', err);

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    error = handleValidationError(err);
  }

  // Mongoose duplicate key error
  if (err.code === 11000) {
    error = handleDuplicateKeyError(err);
  }

  // Mongoose cast error
  if (err.name === 'CastError') {
    error = handleCastError(err);
  }

  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    error = handleJWTError();
  }

  if (err.name === 'TokenExpiredError') {
    error = handleJWTExpiredError();
  }

  // Send error response
  if (process.env.NODE_ENV === 'development') {
    sendErrorDev(error, res);
  } else {
    sendErrorProd(error, res);
  }
};

/**
 * Async error wrapper
 */
export const catchAsync = (fn: Function) => {
  return (req: Request, res: Response, next: NextFunction) => {
    fn(req, res, next).catch(next);
  };
};