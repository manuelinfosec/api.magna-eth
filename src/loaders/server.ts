import bodyParser from 'body-parser';
import { errors as celebrateErrors, isCelebrateError } from 'celebrate';
import cors from 'cors';
import * as express from 'express';
import helmet from 'helmet';
import { Server } from 'socket.io';
import routes from '../api/routes';
import middlewares from '../api/middlewares';
import stream from '../api/routes/stream';
import * as winston from 'winston';

const morgan = require('morgan');

const { printf, combine, timestamp, colorize, json } = winston.format;

const printFormat = winston.createLogger({
  level: 'silly',
  format: combine(
    timestamp(),
    colorize(),
    printf(({ level, message, timestamp }) => `[${timestamp} ${level}: ${message}]`),
  ),
  transports: [new winston.transports.Console()],
});

export default (app: express.Application, io: Server) => {
  // Enable trust for proxy headers (e.g., if using a load balancer or reverse proxy)
  app.enable('trust proxy');

  // Middleware for pretty print logging to console
  app.use(
    morgan(':method :url :status :res[content-length] - :response-time ms', {
      stream: {
        // Configure Morgan to use our custom logger with the http severity
        write: (message) => printFormat.http(message.trim()),
      },
    }),
  );

  // Enable CORS for all routes
  app.use(cors());

  // Set security-related HTTP headers
  app.use(helmet());

  // Parse incoming JSON request bodies
  app.use(bodyParser.json());

  // Middleware for handling validation errors from celebrate + Joi
  app.use(celebrateErrors());

  // Mount API routes
  app.use('/api', routes);

  // Register Socket.io middlewares
  io.use(middlewares.socketAuth);

  // Mount Socket.io
  stream(io);

  // Catch 404 errors and forward to error handler
  app.use((req, res, next) => {
    const error: any = new Error('Not Found');
    error.status = 404;
    next(error);
  });

  // Error handler for unauthorized errors (e.g., from express-jwt library)
  app.use((err, req, res, next) => {
    if (err.name === 'UnauthorizedError') {
      return res.status(err.status).send({ message: err.message }).end();
    }

    // Error handler for validation errors (e.g., from Celebrate + Joi)
    if (isCelebrateError(err)) {
      const details = {};
      for (const [key, value] of err.details.entries()) {
        details[key] = value.message;
      }
      return res.status(422).send({ message: err.message, details }).end();
    }

    // Pass the error to the next error handler if not handled here
    return next(err);
  });

  // General error handler
  app.use((err, req, res, next) => {
    res.status(err.status || 500); // Set status code based on error or default to 500 (Internal Server Error)
    res.json({
      errors: {
        message: err.message, // Send error message in JSON response
      },
    });
  });
};
