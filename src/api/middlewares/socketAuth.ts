import jwt, { JwtPayload } from 'jsonwebtoken';
import config from '../../config';
import Container from 'typedi';
import UserService from '../../services/users';

/**
 * Socket.IO middleware to authenticate users using a JWT token.
 *
 * This middleware extracts the JWT token from the socket handshake headers,
 * verifies the token, retrieves the user information from the database, and
 * attaches the user to the socket object if the token is valid.
 *
 * @param socket - The socket object representing the client connection.
 * @param next - The callback to signal that the middleware function is complete.
 */
const socketAuth = async (socket, next) => {
  try {
    // Extract the JWT token from the socket handshake headers
    const token = socket.handshake.headers['authorization']?.split(' ')[0];

    if (!token) {
      // If no token is provided, return an authentication error
      throw new Error('Authentication error');
    }

    // Verify the JWT token using the secret key from the config
    const decoded = await jwt.verify(token, config.jwtSecret, {
      complete: true,
    });

    // Get an instance of the UserService from the Typedi container
    const userService = Container.get(UserService);

    // Retrieve the user from the database using the ID from the token payload
    const user = await userService.findOne({ where: { id: (decoded.payload as JwtPayload).id } });

    if (!user) {
      // If no user is found, return an authentication error
      throw new Error('Authentication error');
    }

    // Attach the user to the socket object for further use in the application
    socket.user = user;

    // Proceed to the next middleware or route handler
    next();
  } catch (err) {
    // In case of any errors during the process, pass the error to the next middleware
    next(err);
  }
};

export default socketAuth;
