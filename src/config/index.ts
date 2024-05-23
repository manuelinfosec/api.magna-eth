import * as dotenv from 'dotenv';

process.env.NODE_ENV = process.env.NODE_ENV || 'development';

const envFound = dotenv.config();
if (!envFound) {
  // Throw generic error
  throw new Error("Couldn't find .env file");
}

export default {
  /**
   *  Application port.
   */
  port: parseInt(process.env.PORT) || 3000,

  /**
   * JWT Secret
   */
  jwtSecret: process.env.JWT_SECRET,

  /**
   * Ethereum Nodes Website
   */
  ethereumNodeWebsite: process.env.ETHEREUM_NODE_LIST || 'http://ethereumnodes.com',

  /**
   * Ethereum to USD exchange rate
   */
  ethToUsd: 5000,

  /**
   * Postgres connection options.
   */
  database: {
    type: process.env.TYPEORM_CONNECTION,
    /**
     * Connection url where perform connection to.
     */
    url: process.env.TYPEORM_HOST,
    /**
     * Database host.
     */
    host: process.env.TYPEORM_HOST,
    /**
     * Database host port.
     */
    // tslint:disable-next-line: radix
    port: Number.parseInt(process.env.TYPEORM_PORT),
    /**
     * Database username.
     */
    username: process.env.TYPEORM_USERNAME,
    /**
     * Database password.
     */
    password: process.env.TYPEORM_PASSWORD,
    /**
     * Database name to connect to.
     */
    database: process.env.TYPEORM_DATABASE,
  },
};
