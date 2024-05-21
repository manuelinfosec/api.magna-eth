import * as express from 'express';
import 'reflect-metadata';
import database from './database';
import server from './server';
import { Container } from 'typedi';
import NodeService from '../services/nodes';

export default async (app: express.Application) => {
  // Scrape and initialize Ethereum nodes
  Container.get(NodeService).scrapeNodes();
  console.log('Created RPC Nodes pool');

  // Initialize and connect to the database
  await database();
  console.log('DB loaded and connected!');

  // Initialize and configure the Express server
  await server(app);
  console.log('Server loaded!');
};
