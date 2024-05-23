import * as argon2 from 'argon2';
import { randomBytes } from 'crypto';
import * as jwt from 'jsonwebtoken';
import { Service } from 'typedi';
import { Repository } from 'typeorm';
import { InjectRepository } from 'typeorm-typedi-extensions';
import config from '../config';
import { Exception } from '../Exception';
import { User } from '../models/User';

/**
 * AuthService handles user authentication-related operations such as sign-up and sign-in.
 */
@Service()
export default class AuthService {
  /**
   * Constructor for AuthService.
   *
   * @param userRepository - Injected repository for User entity to interact with the database.
   */
  constructor(@InjectRepository(User) private readonly userRepository: Repository<User>) {}

  /**
   * Signs up a new user.
   *
   * @param {User} inputUser - The user data for the new user.
   * @returns {Promise<{ user: User; token: string }>} - The created user and a JWT token.
   * @throws Will throw an error if the user cannot be created or if a user already exists.
   */
  public async SignUp(inputUser: User): Promise<{ user: User; token: string }> {
    try {
      // Generate a random salt
      const salt = randomBytes(32);

      // Hash the user's password with the salt
      const hashedPassword = await argon2.hash(inputUser.password, { salt });

      // Save the new user to the database
      const userRecord = await this.userRepository.save({
        ...inputUser,
        salt: salt.toString('hex'),
        password: hashedPassword,
      });

      if (!userRecord) {
        throw new Error('User cannot be created');
      }

      // Generate a JWT token for the new user
      const token = this.generateToken(userRecord);

      // Remove sensitive information from the user object before returning
      const user = this.transformUser(userRecord);

      return { user, token };
    } catch (error) {
      // Check for PostgreSQL unique violation error
      // https://www.postgresql.org/docs/current/errcodes-appendix.html
      if (error.code === '23505') {
        // Handle duplicate username error
        throw new Error('User already exist!');
      }
      // Other errors
      console.log(error);
      throw error;
    }
  }

  /**
   * Signs in an existing user.
   *
   * @param {string} email - The email of the user trying to sign in.
   * @param {string} password - The password of the user trying to sign in.
   * @returns {Promise<{ user: User; token: string }>} - The authenticated user and a JWT token.
   * @throws Will throw an error if the user is not found or if the password is invalid.
   */
  public async SignIn(email: string, password: string): Promise<{ user: User; token: string }> {
    // Find the user by email
    const userRecord = await this.userRepository.findOne({ where: { email } });

    if (!userRecord) {
      throw new Exception('User not found!', 404);
    }

    /**
     * Verify the password using argon2 to prevent 'timing based' attacks
     */
    const validPassword = await argon2.verify(userRecord.password, password);
    if (!validPassword) {
      throw new Error('Invalid Password');
    }

    // Generate a JWT token for the authenticated user
    const token = this.generateToken(userRecord);

    // Remove sensitive information from the user object before returning
    const user = this.transformUser(userRecord);

    return { user, token };
  }

  /**
   * Generates a JWT token for a user.
   *
   * @param {User} user - The user for whom to generate the token.
   * @returns {string} - The generated JWT token.
   */
  private generateToken(user: User): string {
    const today = new Date();
    const exp = new Date(today);
    exp.setDate(today.getDate() + 7); // Set the token to expire in 7 days

    return jwt.sign(
      {
        id: user.id, // User ID
        name: user.name, // User name
        exp: exp.getTime() / 1000, // Token expiration time in seconds
      },
      config.jwtSecret, // JWT secret key from environment
    );
  }

  /**
   * Transforms a user entity by removing sensitive information.
   *
   * @param {User} user - The user entity to transform.
   * @returns {User} - The transformed user entity with sensitive information removed.
   */
  private transformUser(user: User): User {
    // Create shallow copy to avoid modifying original object
    const transformedUser = { ...user };

    // Delete `password` and `salt` properties
    Reflect.deleteProperty(transformedUser, 'password');
    Reflect.deleteProperty(transformedUser, 'salt');

    return transformedUser;
  }
}
