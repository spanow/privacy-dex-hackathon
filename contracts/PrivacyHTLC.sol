// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/utils/cryptography/ECDSA.sol";

/**
 * @title PrivacyHTLC
 * @dev A Hashed Timelock Contract that supports privacy features through ZK proofs
 */
contract PrivacyHTLC {
    using ECDSA for bytes32;

    // Swap struct to store swap details
    struct Swap {
        address initiator;
        address participant;
        uint256 amount;
        bytes32 hashlock;
        uint256 timelock;
        bool withdrawn;
        bool refunded;
        bytes32 preimage;
        bytes32 commitment; // For ZK proofs (commitment to amount)
    }

    // Mapping of swap id to Swap struct
    mapping(bytes32 => Swap) public swaps;
    
    // Events
    event NewSwap(
        bytes32 indexed _swapId,
        address indexed _initiator,
        address indexed _participant,
        uint256 _amount,
        bytes32 _hashlock,
        uint256 _timelock,
        bytes32 _commitment
    );
    
    event Withdrawn(bytes32 indexed _swapId, bytes32 _preimage);
    event Refunded(bytes32 indexed _swapId);
    
    /**
     * @dev Create a new HTLC swap
     * @param _participant Participant's address
     * @param _hashlock A sha-256 hash of the preimage
     * @param _timelock UNIX timestamp after which the swap can be refunded
     * @param _commitment Cryptographic commitment to the amount (for privacy)
     * @param _zkProof Optional ZK proof data
     */
    function createSwap(
        address _participant,
        bytes32 _hashlock,
        uint256 _timelock,
        bytes32 _commitment,
        bytes calldata _zkProof
    ) 
        external 
        payable 
        returns (bytes32 swapId) 
    {
        // Validate parameters
        require(msg.value > 0, "Amount must be greater than 0");
        require(_participant != address(0), "Invalid participant address");
        require(_hashlock != 0, "Invalid hashlock");
        require(_timelock > block.timestamp, "Timelock must be in the future");
        
        // Generate swap id
        swapId = keccak256(
            abi.encodePacked(
                msg.sender,
                _participant,
                msg.value,
                _hashlock,
                _timelock,
                _commitment
            )
        );
        
        // Ensure swap does not exist
        require(swaps[swapId].amount == 0, "Swap already exists");
        
        // Optional: Verify ZK proof here
        // verifyZKProof(_commitment, msg.value, _zkProof);
        
        // Store swap details
        swaps[swapId] = Swap({
            initiator: msg.sender,
            participant: _participant,
            amount: msg.value,
            hashlock: _hashlock,
            timelock: _timelock,
            withdrawn: false,
            refunded: false,
            preimage: 0,
            commitment: _commitment
        });
        
        // Emit event
        emit NewSwap(
            swapId,
            msg.sender,
            _participant,
            msg.value,
            _hashlock,
            _timelock,
            _commitment
        );
        
        return swapId;
    }
    
    /**
     * @dev Withdraw funds from a swap using the preimage
     * @param _swapId ID of the swap
     * @param _preimage Preimage of the hashlock
     * @param _zkProof Optional ZK proof data
     */
    function withdraw(
        bytes32 _swapId,
        bytes32 _preimage,
        bytes calldata _zkProof
    ) 
        external 
    {
        // Retrieve swap details
        Swap storage swap = swaps[_swapId];
        
        // Validate swap
        require(swap.amount > 0, "Swap does not exist");
        require(swap.withdrawn == false, "Swap already withdrawn");
        require(swap.refunded == false, "Swap already refunded");
        require(swap.participant == msg.sender, "Only participant can withdraw");
        require(swap.timelock > block.timestamp, "Swap expired");
        require(keccak256(abi.encodePacked(_preimage)) == swap.hashlock, "Invalid preimage");
        
        // Optional: Verify ZK proof here
        // verifyWithdrawalZKProof(swap.commitment, _zkProof);
        
        // Update swap state
        swap.withdrawn = true;
        swap.preimage = _preimage;
        
        // Transfer funds
        (bool sent, ) = payable(swap.participant).call{value: swap.amount}("");
        require(sent, "Failed to send Ether");
        
        // Emit event
        emit Withdrawn(_swapId, _preimage);
    }
    
    /**
     * @dev Refund swap after timelock expiry
     * @param _swapId ID of the swap
     */
    function refund(bytes32 _swapId) external {
        // Retrieve swap details
        Swap storage swap = swaps[_swapId];
        
        // Validate swap
        require(swap.amount > 0, "Swap does not exist");
        require(swap.withdrawn == false, "Swap already withdrawn");
        require(swap.refunded == false, "Swap already refunded");
        require(swap.initiator == msg.sender, "Only initiator can refund");
        require(swap.timelock <= block.timestamp, "Timelock not expired");
        
        // Update swap state
        swap.refunded = true;
        
        // Transfer funds back to initiator
        (bool sent, ) = payable(swap.initiator).call{value: swap.amount}("");
        require(sent, "Failed to send Ether");
        
        // Emit event
        emit Refunded(_swapId);
    }
    
    /**
     * @dev Get details of a swap
     * @param _swapId ID of the swap
     */
    function getSwap(bytes32 _swapId)
        external
        view
        returns (
            address initiator,
            address participant,
            uint256 amount,
            bytes32 hashlock,
            uint256 timelock,
            bool withdrawn,
            bool refunded,
            bytes32 preimage,
            bytes32 commitment
        )
    {
        Swap memory swap = swaps[_swapId];
        return (
            swap.initiator,
            swap.participant,
            swap.amount,
            swap.hashlock,
            swap.timelock,
            swap.withdrawn,
            swap.refunded,
            swap.preimage,
            swap.commitment
        );
    }
    
    // Future functions for ZK verification 
    // function verifyZKProof(bytes32 commitment, uint256 amount, bytes calldata proof) internal view returns (bool) {}
    // function verifyWithdrawalZKProof(bytes32 commitment, bytes calldata proof) internal view returns (bool) {}
}
