import { celebrate, Joi } from 'celebrate';
import { NextFunction, Request, Response, Router } from 'express';
import { Container } from 'typedi';
import { User } from '../../../models/User';
import AuthService from '../../../services/auth';
import middlewares from '../../middlewares';
import { privateEncrypt } from 'crypto';

const route = Router();

/**
 * Sets up the authentication routes in the Express application.
 *
 * @param {Express.Application} app - The Express application instance.
 */
export default (app) => {
  // Register the /auth route with the provided route handlers
  app.use('/auth', route);

  /**
   * Route to register a new user.
   *
   * @route POST /auth/register
   * @group Auth - Authentication routes
   * @param {string} name.body.required - The name of the new user
   * @param {string} email.body.required - The email of the new user
   * @param {string} password.body.required - The password of the new user
   * @returns {object} 201 - An object containing the user and a JWT token
   * @returns {Error}  default - Unexpected error
   */
  route.post(
    '/register',
    // Validate the request body using celebrate and Joi
    celebrate({
      body: Joi.object({
        name: Joi.string().min(2).max(30).required(),
        email: Joi.string().trim().email().required(),
        password: Joi.string().min(8).max(30).required(),
      }),
    }),
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        // Get an instance of AuthService from the Typedi container
        const authServiceInstance = Container.get(AuthService);
        // Call the SignUp method to create a new user and generate a JWT token
        const { user, token } = await authServiceInstance.SignUp(req.body as User);
        // Respond with the created user and token, setting the status code to 201 (Created)
        return res.json({ user, token }).status(201);
      } catch (e) {
        // Log any errors that occur
        console.log(' error ', e);
        // Pass the error to the next middleware for handling
        return next(e);
      }
    },
  );

  /**
   * Route to log in an existing user.
   *
   * @route POST /auth/login
   * @group Auth - Authentication routes
   * @param {string} email.body.required - The email of the user
   * @param {string} password.body.required - The password of the user
   * @returns {object} 200 - An object containing the user and a JWT token
   * @returns {Error}  default - Unexpected error
   */
  route.post(
    '/login',
    // Validate the request body using celebrate and Joi
    celebrate({
      body: Joi.object({
        email: Joi.string().trim().email().required(),
        password: Joi.string().min(8).max(30).required(),
      }),
    }),
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        const { email, password } = req.body;
        // Get an instance of AuthService from the Typedi container
        const authServiceInstance = Container.get(AuthService);
        // Call the SignIn method to authenticate the user and generate a JWT token
        const { user, token } = await authServiceInstance.SignIn(email, password);
        // Respond with the authenticated user and token, setting the status code to 200 (OK)
        return res.json({ user, token }).status(200);
      } catch (e) {
        // Log any errors that occur
        console.log(' error ', e);
        // Pass the error to the next middleware for handling
        return next(e);
      }
    },
  );

//   /**
//    * Route to log out the currently authenticated user.
//    *
//    * @route POST /auth/logout
//    * @group Auth - Authentication routes
//    * @security JWT
//    * @returns {void} 200 - Successful logout
//    * @returns {Error}  default - Unexpected error
//    */
//   route.post(
//     '/logout',
//     // Middleware to check if the user is authenticated
//     middlewares.isAuth,
//     async (req: Request, res: Response, next: NextFunction) => {
//       try {
//         // @TODO: Implement AuthService.Logout(req.user) to handle any necessary logout operations
//         return res.status(200).end();
//       } catch (e) {
//         // Log any errors that occur
//         console.log(' error ', e);
//         // Pass the error to the next middleware for handling
//         return next(e);
//       }
//     },
//   );
// };
