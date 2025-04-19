pragma circom 2.1.4;

include "node_modules/circomlib/circuits/comparators.circom";
include "node_modules/circomlib/circuits/poseidon.circom";

/*
 * Circuit for private amount verification
 * Proves that you know an amount that:
 * 1. Is positive and within proper range
 * 2. Matches the commitment stored on-chain
 * 3. Satisfies the exchange rate rules
 */
template AmountPrivacy() {
    // Public inputs (known to verifier)
    signal input commitment; // Poseidon hash commitment of the amount
    signal input exchangeRate; // Current exchange rate * 1000 (integer)
    signal input maxAmount; // Maximum allowed amount
    
    // Private inputs (only known to prover)
    signal input amount; // The actual amount being transferred
    signal input salt; // Random salt for the commitment
    
    // Ensure amount is positive and within limits
    component rangeCheck = LessThan(64); // 64-bit range check
    rangeCheck.in[0] <== amount;
    rangeCheck.in[1] <== maxAmount;
    rangeCheck.out === 1;
    
    // Compute the commitment hash
    component hasher = Poseidon(2);
    hasher.inputs[0] <== amount;
    hasher.inputs[1] <== salt;
    
    // Verify the commitment matches
    commitment === hasher.out;
    
    // Calculate the expected equivalent amount after exchange
    // exchangedAmount = amount * exchangeRate / 1000
    signal exchangedAmount <-- (amount * exchangeRate) \ 1000;
    
    // Ensure exchanged amount is valid
    exchangedAmount * 1000 === amount * exchangeRate;
}

component main {public [commitment, exchangeRate, maxAmount]} = AmountPrivacy();
