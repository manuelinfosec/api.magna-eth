import * as express from 'express';
import 'reflect-metadata';
import database from './database';
import server from './server';
import { Container } from 'typedi';
import NodeService from '../services/nodes';

export default async (app: express.Application, io) => {
  // Scrape and initialize Ethereum nodes
  let nodeService = await Container.get(NodeService);
  await nodeService.scrapeNodes();
  let value = await nodeService.getNode();
  console.log(value);
  console.log('Created RPC Nodes pool');

  // Initialize and connect to the database
  await database();
  console.log('DB loaded and connected!');

  // Initialize and configure the Express server
  await server(app, io);
  console.log('Server loaded!');
};
