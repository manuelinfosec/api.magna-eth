import { expressjwt as jwt } from 'express-jwt';
import config from '../../config';

/**
 * Extracts the JWT token from the Authorization header.
 *
 * We are assuming that the JWT will come in a header with the form:
 * Authorization: Bearer ${JWT}
 *
 * @param {Request} req - The Express request object.
 * @returns {string | null} - The extracted JWT token, or null if not present.
 * @throws {Error} - Throws an error if the authorization header is missing, malformed, or the scheme is unsupported.
 */
const getTokenFromHeader = (req) => {
  // Extract the 'authorization' header from the request
  const { authorization } = req.headers;

  // Check if the 'authorization' header is missing
  if (!authorization) {
    throw new Error('Authorization header is missing');
  }

  // Split the 'authorization' header into parts using space as the delimiter
  const parts = authorization.split(' ');

  // Check if the 'authorization' header is malformed
  if (parts.length !== 2) {
    throw new Error('Authorization header is malformed');
  }

  // Extract the scheme and token from the 'authorization' header
  const scheme = parts[0];
  const token = parts[1];

  // Check if the scheme is neither 'Token' nor 'Bearer'
  if (scheme !== 'Token' && scheme !== 'Bearer') {
    throw new Error('Authorization header scheme is not supported');
  }

  // Return the extracted token
  return token;
};

const isAuth = jwt({
  algorithms: ['HS256'], // This is the default algorithm used by jsonwebtoken
  secret: config.jwtSecret, // The _secret_ to sign the JWTs
  getToken: getTokenFromHeader, // How to extract the JWT from the request
});

export default isAuth;
