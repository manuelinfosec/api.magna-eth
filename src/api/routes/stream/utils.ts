export default function extractTransactionDetails(transaction) {
  return {
    senderAddress: transaction.from,
    receiverAddress: transaction.to,
    blockNumber: transaction.blockNumber,
    blockHash: transaction.blockHash,
    transactionHash: transaction.hash,
    gasPriceInWei: parseInt(transaction.gasPrice, 16),
    valueInWei: parseInt(transaction.value, 16),
  };
}
