import { Server, Socket } from 'socket.io';
import { Container } from 'typedi';
import BlockService from '../../../services/blocks';
import TransactionFilterService from '../../../services/transactions';

// Get service instances from Typedi container
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
     *
     * @param {Object} filter - The filter criteria for transactions.
     * @param {string | null} [filter.block] - Block to stream (defaults to the latest block).
     * @param {string} [filter.type] - The type of filter ('all', 'sender', 'receiver').
     * @param {string} [filter.address] - The Ethereum address to filter by.
     * @param {Array<number>} [filter.range] - The value range to filter by.
     */
    socket.on('subscribe', async (filter) => {

      // Get the latest block
      const block = await blockService.getBlock(filter.block);
      let transactions = block.transactions;

      // Filter transactions based on the provided filter criteria
      if (filter.type === 'all' && filter.address) {
        transactions = transactionFilterService.filterTransactions(transactions, filter.address);
      } else if (filter.type === 'sender') {
        transactions = transactionFilterService.filterBySender(transactions, filter.address);
      } else if (filter.type === 'receiver') {
        transactions = transactionFilterService.filterByReceiver(transactions, filter.address);
      } else if (filter.range) {
        transactions = transactionFilterService.filterByValueRange(transactions, filter.range);
      }

      // Stream each transaction one at a time
      for (const transaction of transactions) {
        socket.emit('transaction', transaction);
        // Introduce a 1-second delay to prevent overwhelming the client
        await new Promise((resolve) => setTimeout(resolve, 1000));
      }
    });
  });
};
