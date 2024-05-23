import config from '../config';
import { Service } from 'typedi';

/**
 * Converts a hexadecimal string representing Wei to Ether (ETH).
 * @param {string} hexString - The hexadecimal string representing Wei.
 * @returns {Number} - The converted value in Ether (ETH).
 */
function hexToEth(hexString: string): number {
  return parseInt(hexString, 16) / 10 ** 18;
}

/**
 * Service to filter Ethereum transactions based on different criteria.
 */
@Service()
export default class TransactionFilterService {
  /**
   * Filters transactions to include only those where the specified address is either the sender or the receiver.
   * If no address is specified, all transactions are included.
   *
   * @param {Array} transactions - The list of transactions to filter.
   * @param {string|null} [address=null] - The address to filter by. If null, all transactions are included.
   * @returns {Array} - The filtered list of transactions.
   */
  filterTransactions(transactions: any[], address: string | null = null): any[] {
    return transactions.filter((tx) => {
      if (!address) return true;
      return tx.from === address || tx.to === address;
    });
  }

  /**
   * Filters transactions to include only those where the specified address is the sender.
   *
   * @param {Array} transactions - The list of transactions to filter.
   * @param {string} address - The address to filter by.
   * @returns {Array} - The filtered list of transactions where the specified address is the sender.
   */
  filterBySender(transactions: any[], address: string): any[] {
    return transactions.filter((tx) => tx.from === address);
  }

  /**
   * Filters transactions to include only those where the specified address is the receiver.
   *
   * @param {Array} transactions - The list of transactions to filter.
   * @param {string} address - The address to filter by.
   * @returns {Array} - The filtered list of transactions where the specified address is the receiver.
   */
  filterByReceiver(transactions: any[], address: string): any[] {
    return transactions.filter((tx) => tx.to === address);
  }

  /**
   * Filters transactions to include only those that fall within the specified value range in USD.
   *
   * @param {Array} transactions - The list of transactions to filter.
   * @param {string} range - The value range to filter by, specified as one of the following: '0-100', '100-500', '500-2000', '2000-5000', '>5000'.
   * @returns {Array} - The filtered list of transactions that fall within the specified value range in USD.
   */
  filterByValueRange(transactions: any[], range: string): any[] {
    // Conversion rate from ETH to USD
    const ethToUsd = config.ethToUsd;

    // Define the ranges in USD
    const ranges: { [key: string]: [number, number] } = {
      '0-100': [0, 100],
      '100-500': [100, 500],
      '500-2000': [500, 2000],
      '2000-5000': [2000, 5000],
      '>5000': [5000, Infinity],
    };

    // Get the min and max values for the specified range
    const [min, max] = ranges[range];

    // Filter transactions based on their value in USD
    return transactions.filter((tx) => {
      const valueInEth = hexToEth(tx.value);
      const valueInUsd = valueInEth * ethToUsd;
      return valueInUsd >= min && valueInUsd < max;
    });
  }
}
