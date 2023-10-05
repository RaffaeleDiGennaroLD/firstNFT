//Contract based on [https://docs.openzeppelin.com/contracts/3.x/erc721](https://docs.openzeppelin.com/contracts/3.x/erc721)
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/security/Pausable.sol";

contract VetrinaverseArt is ERC721URIStorage, Ownable, Pausable {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;

    constructor() ERC721("VetrinaverseArt", "VV") {}

    function transferFunds() public payable {
        require(msg.value > 0, "Amount must be greater than 0");

        // Transfer funds to the contract owner
        payable(owner()).transfer(msg.value);
    }

    function mintNFT(string memory tokenURI) public payable returns (uint256) {
        _tokenIds.increment();
        uint256 newItemId = _tokenIds.current();
        _mint(owner(), newItemId);
        _setTokenURI(newItemId, tokenURI);
        if (newItemId != 0) transferFunds();
        return newItemId;
    }
}
