pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";

contract Tomatoken is ERC1155 {

	uint public constant TOMATOKENS = 0;
	uint public constant TOMATOKEN_PRICE_IN_WEI = 10**12;
	uint public constant TOMATOKEN_REWARD = 0;
	event TomatokenBought(address indexed buyer, uint amount);
	event TomatokenRewarded(address indexed buyer, uint amount);

	constructor() ERC1155("") {
		// owner = msg.sender;
		_mint(address(this), TOMATOKENS, 10**18, "");
	}

	function buyTokens() public payable {
		require(uint(msg.value) % TOMATOKEN_PRICE_IN_WEI == 0, "Only accepting the full price");
		uint amountOfTomatokens = uint(msg.value) / TOMATOKEN_PRICE_IN_WEI;
		_safeTransferFrom(address(this),  msg.sender, TOMATOKENS, amountOfTomatokens, "");
		emit TomatokenBought(msg.sender, amountOfTomatokens);
	}

	function rewardTomatoken() public {
		require(balanceOf(address(this), TOMATOKENS) > 0, "There is no more Tomatoken to reward");
		_safeTransferFrom(address(this), msg.sender, TOMATOKEN_REWARD, 1, "");
		emit TomatokenRewarded(msg.sender, TOMATOKEN_REWARD);
	}
}


