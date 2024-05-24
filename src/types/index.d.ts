import { User } from '../models/User';

/**
 * Augment the global Express namespace to include a new property in the Request interface.
 */
declare global {
  namespace Express {
    /**
     * Extends the Request interface in Express to include a new property for the current user.
     */
    export interface Request {
      /**
       * Property to store the current user object in the request.
       *
       * @type {User} - The type of the currentUser property is a User object.
       */
      currentUser: User;
    }
  }

  export interface Error {
    data: Object;
  }
}

declare module 'socket.io' {
  /**
   * Extends the Socket interface in Socket.IO to include a new property for the current user.
   */
  export interface Socket {
    /**
     * Property to store the current user object in the socket.
     *
     * @type {User} - The type of the user property is a User object.
     */
    user?: User;
  }
}
