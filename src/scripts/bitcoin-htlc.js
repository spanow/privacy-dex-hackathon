/**
 * Bitcoin Hashed Timelock Contract (HTLC) Implementation
 * This is a simplified implementation for demonstration purposes
 */

const bitcoin = require('bitcoinjs-lib');
const crypto = require('crypto');

// Use testnet for hackathon demonstration
const network = bitcoin.networks.testnet;

/**
 * Generate a Bitcoin P2SH HTLC script
 * @param {string} recipientPubKey - Recipient's public key
 * @param {string} senderPubKey - Sender's public key
 * @param {string} hashLock - SHA256 hash of the secret (preimage)
 * @param {number} timelock - Timelock in blocks (relative)
 * @returns {Object} - Script and related information
 */
function createHTLC(recipientPubKey, senderPubKey, hashLock, timelock) {
  // Create the redeem script for the HTLC
  // This script allows spending by:
  // 1. The recipient, if they provide the correct preimage
  // 2. The sender, after the timelock has expired
  const redeemScript = bitcoin.script.compile([
    bitcoin.script.number.encode(timelock),
    bitcoin.opcodes.OP_CHECKSEQUENCEVERIFY,
    bitcoin.opcodes.OP_DROP,
    bitcoin.opcodes.OP_DUP,
    bitcoin.opcodes.OP_HASH160,
    Buffer.from(senderPubKey, 'hex'),
    bitcoin.opcodes.OP_EQUALVERIFY,
    bitcoin.opcodes.OP_CHECKSIG,
    bitcoin.opcodes.OP_ELSE,
    bitcoin.opcodes.OP_HASH256,
    Buffer.from(hashLock, 'hex'),
    bitcoin.opcodes.OP_EQUALVERIFY,
    bitcoin.opcodes.OP_DUP,
    bitcoin.opcodes.OP_HASH160,
    Buffer.from(recipientPubKey, 'hex'),
    bitcoin.opcodes.OP_EQUALVERIFY,
    bitcoin.opcodes.OP_CHECKSIG,
    bitcoin.opcodes.OP_ENDIF
  ]);

  // Generate P2SH address from redeem script
  const p2sh = bitcoin.payments.p2sh({
    redeem: { output: redeemScript, network },
    network
  });

  return {
    address: p2sh.address,
    redeemScript: redeemScript.toString('hex'),
    p2sh: p2sh
  };
}

/**
 * Create transaction spending from HTLC by revealing the preimage
 * @param {Object} htlc - HTLC object from createHTLC
 * @param {string} preimage - Secret preimage
 * @param {string} privateKey - Recipient's private key
 * @param {string} utxo - UTXO information (txid, vout, amount)
 * @param {string} destinationAddress - Where to send the funds
 * @returns {string} - Raw transaction hex
 */
function createClaimTransaction(htlc, preimage, privateKey, utxo, destinationAddress) {
  const keyPair = bitcoin.ECPair.fromWIF(privateKey, network);
  
  // Create a transaction
  const txb = new bitcoin.TransactionBuilder(network);
  
  // Add the input from the HTLC
  txb.addInput(utxo.txid, utxo.vout);
  
  // Account for fees (simplified)
  const fee = 1000; // Satoshis
  const amount = utxo.amount - fee;
  
  // Add the output to the destination address
  txb.addOutput(destinationAddress, amount);
  
  // Sign the transaction with the preimage
  const hashType = bitcoin.Transaction.SIGHASH_ALL;
  txb.sign(0, keyPair, htlc.p2sh.redeem.output, hashType, amount, [
    Buffer.from(preimage, 'hex'),
    bitcoin.opcodes.OP_TRUE
  ]);
  
  // Build and return the transaction
  return txb.build().toHex();
}

/**
 * Create refund transaction after timelock expiry
 * @param {Object} htlc - HTLC object from createHTLC
 * @param {string} privateKey - Sender's private key
 * @param {string} utxo - UTXO information (txid, vout, amount)
 * @param {string} destinationAddress - Where to send the funds
 * @returns {string} - Raw transaction hex
 */
function createRefundTransaction(htlc, privateKey, utxo, destinationAddress) {
  const keyPair = bitcoin.ECPair.fromWIF(privateKey, network);
  
  // Create a transaction
  const txb = new bitcoin.TransactionBuilder(network);
  
  // Add the input from the HTLC with sequence number for timelock
  const sequence = 0xfffffffe; // Enable relative timelock
  txb.addInput(utxo.txid, utxo.vout, sequence);
  
  // Account for fees (simplified)
  const fee = 1000; // Satoshis
  const amount = utxo.amount - fee;
  
  // Add the output to the destination address
  txb.addOutput(destinationAddress, amount);
  
  // Sign the transaction
  const hashType = bitcoin.Transaction.SIGHASH_ALL;
  txb.sign(0, keyPair, htlc.p2sh.redeem.output, hashType, amount, [
    bitcoin.opcodes.OP_FALSE
  ]);
  
  // Build and return the transaction
  return txb.build().toHex();
}

/**
 * Generate hash lock from preimage
 * @param {string} preimage - Secret preimage as hex string
 * @returns {string} - SHA256 hash as hex string
 */
function generateHashLock(preimage) {
  const hash = crypto.createHash('sha256')
                    .update(Buffer.from(preimage, 'hex'))
                    .digest('hex');
  return hash;
}

/**
 * Utility function to generate a random preimage
 * @returns {string} - Random 32-byte preimage as hex string
 */
function generateRandomPreimage() {
  return crypto.randomBytes(32).toString('hex');
}

module.exports = {
  createHTLC,
  createClaimTransaction,
  createRefundTransaction,
  generateHashLock,
  generateRandomPreimage
};
