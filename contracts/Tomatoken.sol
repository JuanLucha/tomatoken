pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";

contract Tomatoken is ERC1155 {
	uint public constant TOMATOKENS = 0;

	constructor() ERC1155("") {
		_mint(msg.sender, TOMATOKENS, 10**18, "");
	}
}