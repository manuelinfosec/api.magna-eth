import { Request, Response, Router } from 'express';
import middlewares from '../../middlewares';

const route = Router();

/**
 * Sets up the /users routes in the Express application.
 *
 * @param {Router} app - The Express application or main router instance.
 */
export default (app: Router) => {
  // Register the /users route with the route handler
  app.use('/users', route);

  /**
   * Route to get the current authenticated user's information.
   *
   * @route GET /users/me
   * @group Users - User-related operations
   * @returns {object} 200 - An object containing the current authenticated user's information
   * @returns {Error}  default - Unexpected error
   */
  route.get(
    '/me',
    // Middleware to check if the user is authenticated
    middlewares.isAuth,
    // Middleware to attach the current authenticated user's information to the request
    middlewares.attachCurrentUser,
    async (req: Request, res: Response) => {
      // Respond with the current authenticated user's information
      return res.json({ user: req.currentUser }).status(200);
    },
  );
};
