import { Service } from 'typedi';
import fetch from 'node-fetch';
import * as cheerio from 'cheerio';
import config from '../config';

@Service()
class NodeService {
  private nodes: string[] = [];

  public async scrapeNodes() {
    try {
      const response = await fetch(config.ethereumNodeWebsite);
      const data = await response.text();

      const $ = cheerio.load(data);

      $('div.jsx-cbbca5b1a7ae850f.node.down').each((index, element) => {
        $(element)
          .find('input.jsx-cbbca5b1a7ae850f.endpoint')
          .each((index, inputElement) => {
            const value = $(inputElement).val() as string;
            this.nodes.push(value);
          });
      });
    } catch (error) {
      console.error('Error scraping Ethereum nodes', error);
    }
  }

  public getNodes(): string[] {
    return this.nodes;
  }
}
