import { Container } from 'typedi';
import UserService from '../../services/users';

/**
 * Middleware function to attach user information to the request object.
 *
 * @param {object} req - Express request object.
 * @param {object} res - Express response object.
 * @param {function} next - Express next function.
 */
const attachCurrentUser = async (req, res, next) => {
  try {
    // Get an instance of the UserService from the Typedi container
    const userServiceInstance = Container.get(UserService);

    // Find the user record based on the authentication token ID
    const userRecord = await userServiceInstance.findOne({where: {id: req.auth.id}});

    // If user record is not found, return a 401 Unauthorized status
    if (!userRecord) {
      return res.sendStatus(401);
    }

    // Remove sensitive information from the user object before attaching to the request
    const currentUser = userRecord;
    Reflect.deleteProperty(currentUser, 'password');
    Reflect.deleteProperty(currentUser, 'salt');

    // Attach the current user object to the request object
    req.currentUser = currentUser;

    // Call the next middleware in the chain
    return next();
  } catch (e) {
    // Log any errors that occur during the process
    console.log('Error attaching user to req');
    console.log(e);
    // Pass the error to the next middleware
    return next(e);
  }
};

export default attachCurrentUser;
