import Container from 'typedi';
import { Connection, createConnection, useContainer } from 'typeorm';
import { ConnectionOptions } from 'typeorm';
import config from '../config';
import { User } from '../models/User';

export default async (): Promise<Connection> => {
  // Read connection options from ormconfig file (or ENV variables)
  const connectionOptions: ConnectionOptions = {
    type: 'postgres', // Database type (PostgreSQL)
    host: config.database.host,
    port: config.database.port,
    username: config.database.username,
    password: config.database.password,
    database: config.database.database,
    synchronize: false, // Disable automatic schema synchronization
    logging: false, // Disable logging of SQL queries
    entities: [User], // Register TypeORM entities
  };

  // Typedi + Typeorm
  useContainer(Container);

  // Create a connection using modified connection options
  const connection = await createConnection(connectionOptions);

  return connection;
};
