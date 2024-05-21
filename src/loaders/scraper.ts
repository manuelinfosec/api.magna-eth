import fetch from 'node-fetch';
import * as cheerio from 'cheerio';

export default async function scraper() {
  try {
    // Fetch the HTML content from the website
    const response = await fetch('https://ethereumnodes.com');
    const data = await response.text();

    // Load the HTML content into cheerio
    const $ = cheerio.load(data);

    // Define an array to hold the values
    const values: string[] = [];

    // Select the div elements with the specified class
    $('div.jsx-cbbca5b1a7ae850f.node.down').each((index, element) => {
      // Within each selected div, find the input elements with the specified class and get their values
      $(element).find('input.jsx-cbbca5b1a7ae850f.endpoint').each((i, inputElement) => {
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

// scraper().then((values) => {
//   console.log('Collected values:', values);
// });
