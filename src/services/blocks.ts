import fetch from 'node-fetch';
import { Service } from 'typedi';
import NodeService from './nodes';

// Define the structure of JSON-RPC response
interface JSONRPCResponse<T> {
  jsonrpc: string;
  id: number | null;
  result?: T;
  error?: {
    code: number;
    message: string;
  };
}

/**
 * Service class to interact with Ethereum blocks using JSON-RPC.
 */
@Service()
class BlockService {
  // Constructor to inject NodeService dependency
  constructor(private nodeService: NodeService) {}

  /**
   * Helper method to perform a JSON-RPC call to the Ethereum node.
   *
   * @template T - The expected result type.
   * @param {string} method - The JSON-RPC method name.
   * @param {any[]} params - The parameters for the JSON-RPC method.
   * @returns {Promise<T>} - The result of the JSON-RPC call.
   * @throws Will throw an error if the JSON-RPC call returns an error.
   */
  private async fetchJSONRPC<T>(method: string, params: any[]): Promise<T> {
    // Get an Ethereum node URL from the NodeService
    const nodeUrl = await this.nodeService.getNode();

    // Make a POST request to the Ethereum node with the JSON-RPC payload
    const response = await fetch(nodeUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        jsonrpc: '2.0',
        method,
        params,
        id: 1,
      }),
    });

    // Parse the response as JSON
    const data: JSONRPCResponse<T> = await response.json();

    // If there's an error in the response, throw an error
    if (data.error) {
      throw new Error(`RPC error: ${data.error.message}`);
    }

    // Return the result from the response
    return data.result;
  }

  /**
   * Converts a string input to an integer and then to a hexadecimal string.
   *
   * @param {any} input - The input to be checked and converted.
   * @returns {string | null} - The hexadecimal representation of the integer, or null if conversion is not possible.
   */
  private async parseToHex(input: any): Promise<string | null> {
    // Try to parse the input as an integer
    const parsedInt = parseInt(input, 10);

    // Check if the parsing was successful (parsedInt is a number and not NaN)
    if (isNaN(parsedInt)) {
      return null;
    }

    // Convert the parsed integer to a hexadecimal string and return it
    return parsedInt.toString(16);
  }

  /**
   * Retrieves the latest block number from the Ethereum node.
   *
   * @returns {Promise<string>} - The latest block number as a hexadecimal string.
   */
  private async getLatestBlockNumber(): Promise<string> {
    // Fetch the latest block number using JSON-RPC
    return this.fetchJSONRPC<string>('eth_blockNumber', []);
  }

  /**
   * Retrieves a specific block from the Ethereum node.
   * If no block number is provided, it fetches the latest block.
   *
   * @param {string | number | null} [blockNumber=null] - The block number to fetch. If null, fetches the latest block.
   * @returns {Promise<any>} - The block data.
   */
  public async getBlock(blockNumber: string | number | null = null): Promise<any> {
    // Convert the provided block number to hexadecimal
    let latestBlockNumber = await this.parseToHex(blockNumber);

    // If no block number is provided, get the latest block number
    if (!blockNumber) {
      latestBlockNumber = await this.getLatestBlockNumber();
    }

    // Fetch the block data using JSON-RPC
    const blockData = await this.fetchJSONRPC<any>('eth_getBlockByNumber', [
      latestBlockNumber,
      true,
    ]);

    // Return the block data
    return blockData;
  }
}

export default BlockService;
