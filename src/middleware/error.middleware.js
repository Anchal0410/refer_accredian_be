import { Prisma } from '@prisma/client';

const errorMiddleware = (err, req, res, next) => {
  console.error(err.stack);

  // Default error
  let status = 500;
  let message = 'Internal Server Error';
  let errors = [];

  // Handle Prisma errors
  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    switch (err.code) {
      case 'P2002':
        status = 409;
        message = 'Duplicate entry found';
        break;
      case 'P2025':
        status = 404;
        message = 'Record not found';
        break;
      default:
        status = 400;
        message = 'Database error';
    }
  }

  // Handle validation errors
  if (err.name === 'ValidationError') {
    status = 400;
    message = 'Validation Error';
    errors = Object.values(err.errors).map(error => error.message);
  }

  // Handle email service errors
  if (err.name === 'EmailError') {
    status = 500;
    message = 'Failed to send email';
  }

  res.status(status).json({
    success: false,
    message,
    errors: errors.length > 0 ? errors : [message],
    ...(process.env.NODE_ENV === 'development' && {
      stack: err.stack
    })
  });
};

export default errorMiddleware;