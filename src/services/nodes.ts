import { Service } from 'typedi';
import fetch from 'node-fetch';
import * as cheerio from 'cheerio';
import config from '../config';

/**
 * NodeService scrapes Ethereum node information from the Ethereum Node List Website
 * and making it available through a globally accessible service using dependency injection.
 */
@Service()
export default class NodeService {
  // Pool to store the scraped Ethereum node URLs
  private nodes: string[] = [];
  // Index to keep track of the last returned node
  private currentNodeIndex: number = 0;

  /**
   * Scrape Ethereum nodes from the configured website.
   * This function fetches the HTML content of the page, parses it using cheerio,
   * and extracts the values of input elements within specific divs.
   *
   * @async
   * @returns {Promise<void>}
   */
  public async scrapeNodes(): Promise<void> {
    try {
      // Fetch the HTML content from the configured website
      const response = await fetch(config.ethereumNodeWebsite);
      // Convert the response to text format
      const data = await response.text();

      // Load the HTML content into cheerio for parsing
      const $ = cheerio.load(data);

      // Select each div with the class indicating a node that is active
      $('div.jsx-cbbca5b1a7ae850f.node.up').each((index, element) => {
        // Within each selected div, find input elements with the specific class and extract their values
        $(element)
          .find('input.jsx-cbbca5b1a7ae850f.endpoint')
          .each((index, inputElement) => {
            // Extract the value attribute of the input element
            const value = $(inputElement).val() as string;
            // Add the extracted value to the pool
            this.nodes.push(value);
          });
      });
    } catch (error) {
      // Log any errors that occur during the scraping process
      throw new Error(`Could not scrape nodes: ${error.message}`);
    }
  }

  /**
   * Get the next available Ethereum node URL in a round-robin manner.
   * This function returns the next node URL from the pool of scraped nodes.
   * If the end of the list is reached, it wraps around to the beginning.
   *
   * @returns {string} The next Ethereum node URL.
   */
  public getNode(): string {
    if (this.nodes.length === 0) {
      throw new Error('No nodes available. Please scrape nodes first.');
    }

    // Get the current node URL
    const node = this.nodes[this.currentNodeIndex];
    // Increment the index to point to the next node
    this.currentNodeIndex = (this.currentNodeIndex + 1) % this.nodes.length;

    return node;
  }
}
