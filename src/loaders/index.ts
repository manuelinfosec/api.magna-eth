import * as express from 'express';
import 'reflect-metadata';
import database from './database';
import server from './server';
import scraper from './scraper';

export default async (app: express.Application) => {
  // Scrape and initialize Ethereum nodes
  let nodes = await scraper();

  // Initialize and connect to the database
  await database();
  console.log('DB loaded and connected!');

  // Initialize and configure the Express server
  await server(app);
  console.log('Server loaded!');
};
