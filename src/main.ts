// import * as express from 'express';
// import config from './config';
// import loaders from './loaders';
import fetch from 'node-fetch';
import * as cheerio from 'cheerio';

// // Main function to initialize and start the Express application
// async function main() {
//   // Create an Express application instance
//   const app = express.default();

//   // Load necessary configurations, middleware, routes, etc.
//   await loaders(app);

//   // Start the server with the specified options.
//   // - port: Port number from the configuration (read from environment variable)
//   // - hostname: Hostname on which the server will listen ('0.0.0.0' means listen on all available network interfaces).
//   // - backlog: Maximum length of the queue of pending connections.
//   app.listen({ port: config.port, hostname: '0.0.0.0', backlog: 511 }, () => {
//     console.log(`Server is listening on port ${config.port}`);
//   });

//   // Setup graceful shutdown on receiving the SIGTERM signal
//   process.on('SIGTERM', () => {
//     console.log('SIGTERM signal received.');
//     console.log('Express app closed.');
//     process.exit(0);
//   });
// }

// // Entrypoint
// main();

async function scrapeEthereumNodes() {
  try {
    console.log('Getting page');

    // Fetch the HTML content from the website
    const response = await fetch('https://ethereumnodes.com');
    const data = await response.text();

    console.log('Loading data...');

    // Load the HTML content into cheerio
    const $ = cheerio.load(data);

    // Define an array to hold the values
    const values: string[] = [];

    // Select the div elements with the specified class
    $('div.jsx-cbbca5b1a7ae850f.node.up').each((index, element) => {
      // Within each selected div, find the input elements with the specified class and get their values
      $(element)
        .find('input.jsx-cbbca5b1a7ae850f.endpoint')
        .each((i, inputElement) => {
          const value = $(inputElement).val() as string;

          // Add the value to the array
          values.push(value);
        });
    });

    // Return or log the collected values
    return values;
  } catch (error) {
    console.error('Error scraping Ethereum nodes:', error);
    return [];
  }
}

// Example usage
scrapeEthereumNodes().then((values) => {
  console.log('Collected values:', values);
});
