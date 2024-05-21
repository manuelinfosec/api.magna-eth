import { Service } from 'typedi';
import { FindOneOptions, Repository } from 'typeorm';
import { InjectRepository } from 'typeorm-typedi-extensions';
import { User } from '../models/User';

/**
 * Service class responsible for user-related operations.
 */
@Service()
export default class UserService {
  /**
   * Constructor for UserService.
   *
   * @param userRepository - Injected repository for User entity to interact with the database.
   */
  constructor(@InjectRepository(User) private readonly userRepository: Repository<User>) {}

  /**
   * Retrieves all users from the database.
   *
   * @returns A Promise that resolves to an array of User objects.
   */
  public async findAll(): Promise<User[]> {
    return await this.userRepository.find();
  }

  /**
   * Finds a single user based on provided options.
   *
   * @param options - Options to customize the search query (e.g., where conditions).
   * @returns A Promise that resolves to a single User object if found, or null otherwise.
   */
  public async findOne(options: FindOneOptions<User>): Promise<User> {
    return await this.userRepository.findOne(options);
  }
}
