// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19; // Using 0.8.19 which matches config

contract IdentityAudit {
    event IdentityUsed(
        bytes32 indexed userHash,
        string platformId,
        string actionType,
        uint256 timestamp,
        string ipfsHash
    );

    event ConsentGranted(
        bytes32 indexed userHash,
        string platformId,
        uint256 timestamp,
        string ipfsHash
    );

    event ConsentRevoked(
        bytes32 indexed userHash,
        string platformId,
        uint256 timestamp,
        string ipfsHash
    );

    address public owner;

    constructor() {
        owner = msg.sender;
    }

    function logIdentityUsage(
        bytes32 userHash,
        string memory platformId,
        string memory actionType,
        string memory ipfsHash
    ) public {
        emit IdentityUsed(
            userHash,
            platformId,
            actionType,
            block.timestamp,
            ipfsHash
        );
    }

    function logConsentGranted(
        bytes32 userHash,
        string memory platformId,
        string memory ipfsHash
    ) public {
        emit ConsentGranted(userHash, platformId, block.timestamp, ipfsHash);
    }

    function logConsentRevoked(
        bytes32 userHash,
        string memory platformId,
        string memory ipfsHash
    ) public {
        emit ConsentRevoked(userHash, platformId, block.timestamp, ipfsHash);
    }
}
