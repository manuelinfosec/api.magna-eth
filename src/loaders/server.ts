import bodyParser from 'body-parser';
import { errors, celebrate, isCelebrateError } from 'celebrate';
import cors from 'cors';
import * as express from 'express';
import helmet from 'helmet';
import routes from '../api/routes';

export default (app: express.Application) => {
  // Enable trust for proxy headers
  app.enable('trust proxy');

  // Enable CORS
  app.use(cors());

  // Set security-related HTTP headers
  app.use(helmet());

  // Parse incoming JSON request bodies
  app.use(bodyParser.json());

  // Middleware for handling validation errors from celebrate + Joi
  app.use(errors());

  // Mount API routes
  app.use('/api', routes);

  // Catch 404 errors and forward to error handler
  app.use((req, res, next) => {
    const error: Error = new Error('Not Found');
    error['status'] = 404;
    next(error);
  });

  // Error handler for unauthorized errors (e.g., from express-jwt library)
  app.use((err, req, res, next) => {
    if (err.name === 'UnauthorizedError') {
      return res.status(err.status).send({ message: err.message }).end();
    }

    // Error handler for validation errors (e.g., from Celebrate + Joi)
    if (isCelebrateError(err)) {
      return res.status(422).send({ message: err.message, details: err.details }).end();
    }

    // Pass the error to the next error handler if not handled here
    return next(err);
  });

  // Other errors
  app.use((err, req, res, next) => {
    res.status(err.status || 500); // Set status code based on error or default to 500 (Internal Server Error)
    res.json({
      errors: {
        message: err.message, // Send error message in JSON response
      },
    });
  });
};
