import { Server, Socket } from 'socket.io';
import { Container } from 'typedi';
import BlockService from '../../../services/blocks';
import TransactionFilterService from '../../../services/transactions';

// Get service instances from Typedi container
// These services handle block retrieval and transaction filtering.
const blockService = Container.get(BlockService);
const transactionFilterService = Container.get(TransactionFilterService);

/**
 * Registers the event listeners for Socket.IO.
 *
 * @param {Server} io - The Socket.IO server instance.
 */
export default (io: Server) => {
  // Add Socket.IO event listeners
  io.on('connection', (socket: Socket) => {
    /**
     * Event listener for 'subscribe' event from the client.
     * Handles subscription requests to stream transactions based on various filters.
     * Time complexity: O(2n)
     *
     * @param {Object} filter - The filter criteria for transactions.
     * @param {string | null} [filter.block] - Block to stream (defaults to the latest block).
     * @param {string} [filter.type] - The type of filter ('all', 'sender', 'receiver').
     * @param {string} [filter.address] - The Ethereum address to filter by.
     * @param {Array<number>} [filter.range] - The value range to filter by.
     */
    socket.on('subscribe', async (filter) => {
      try {
        // Get the specified block or the latest block if none is provided.
        const block = await blockService.getBlock(filter.block);
        let transactions = block.transactions; // Extract transactions from the block.

        // Apply the appropriate filter based on the filter criteria provided by the client.
        if (filter.type === 'all') {
          // No additional filtering needed, all transactions are included.
          transactions = transactions;
        } else if (filter.type === 'all' && filter.address) {
          // Filter transactions where the specified address is either the sender or receiver.
          transactionFilterService
            .filterTransactions(transactions, filter.address)
            .forEach(async (transaction) => {
              // Emit each filtered transaction to the client with a 1-second delay between emits.
              socket.emit('transaction', transaction);
              await new Promise((resolve) => setTimeout(resolve, 1000));
            });
        } else if (filter.type === 'sender') {
          // Filter transactions where the specified address is the sender.
          transactionFilterService
            .filterBySender(transactions, filter.address)
            .forEach(async (transaction) => {
              // Emit each filtered transaction to the client with a 1-second delay between emits.
              socket.emit('transaction', transaction);
              await new Promise((resolve) => setTimeout(resolve, 1000));
            });
        } else if (filter.type === 'receiver') {
          // Filter transactions where the specified address is the receiver.
          transactionFilterService
            .filterByReceiver(transactions, filter.address)
            .forEach(async (transaction) => {
              // Emit each filtered transaction to the client with a 1-second delay between emits.
              socket.emit('transaction', transaction);
              await new Promise((resolve) => setTimeout(resolve, 1000));
            });
        } else if (filter.range) {
          // Filter transactions that fall within the specified value range.
          transactionFilterService
            .filterByValueRange(transactions, filter.range)
            .forEach(async (transaction) => {
              // Emit each filtered transaction to the client with a 1-second delay between emits.
              socket.emit('transaction', transaction);
              await new Promise((resolve) => setTimeout(resolve, 1000));
            });
        } else {
          // Emit an error message if the filter is invalid.
          socket.emit('error', { message: 'Invalid filter' });
        }
      } catch (error) {
        // Emit an error message if there is an exception during processing.
        socket.emit('error', { message: error.message });
      }
    });
  });
};
