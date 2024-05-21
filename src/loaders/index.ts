import * as express from 'express';
import 'reflect-metadata';
import database from './database';
import server from './server';

export default async (app: express.Application) => {
  // Initialize and connect to the database
  await database();
  console.log('DB loaded and connected!');

  // Initialize and configure the Express server
  await server(app);
  console.log('Server loaded!');
};
