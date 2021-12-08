pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";

struct Asset {
	uint assetId;
	uint amount;
}

contract Tomatoken is ERC1155 {

	uint public constant TOMATOKENS = 80;
	uint public constant TOMATOKEN_PRICE_IN_WEI = 10**12;
	uint public constant TOMATOKEN_REWARD = 1;
	uint constant NFTomatoes = 80;
	mapping(address => Asset[]) private NFTownership;

	event TomatokenBought(address indexed buyer, uint amount);
	event TomatokenRewarded(address indexed buyer, uint amount);
	event Minted(address indexed buyer, uint[] toMint);
	event NFTomatoBought(address indexed buyer, uint tomatoId);

	constructor() ERC1155("https://bafybeieqd2iu6tq2avxshvg6pjbb5mytyypfwxe6y7oi572ut5ukvny7nq.ipfs.dweb.link/metadata/{id}") {
		// owner = msg.sender;
		uint actual = 0;
		uint[] memory toMint = new uint[](NFTomatoes);
		uint[] memory amounts= new uint[](NFTomatoes);
		Asset memory newAsset;


		// Minting the NFTomatoes
		while(actual != NFTomatoes) {
			toMint[actual] = actual;
			amounts[actual] = 1;
			actual++;
		}
		_mintBatch(address(this), toMint, amounts, "");
		actual = 0;
		while(actual != NFTomatoes) {
			newAsset = Asset(actual, 1);
			NFTownership[address(this)].push(newAsset);
			actual++;
		}

		emit Minted(address(this), toMint);

		// Minting the Tomatoken
		_mint(address(this), TOMATOKENS, 10**18, "");
		newAsset = Asset(NFTomatoes, 10**18);
		NFTownership[address(this)].push(newAsset);
	}

	function buyTokens() public payable {
		require(uint(msg.value) % TOMATOKEN_PRICE_IN_WEI == 0, "Only accepting the full price");
		uint amountOfTomatokens = uint(msg.value) / TOMATOKEN_PRICE_IN_WEI;
		_safeTransferFrom(address(this),  msg.sender, TOMATOKENS, amountOfTomatokens, "");
		emit TomatokenBought(msg.sender, amountOfTomatokens);
	}

	function rewardTomatoken() public {
		require(balanceOf(address(this), TOMATOKENS) > 0, "There is no more Tomatoken to reward");
		_safeTransferFrom(address(this), msg.sender, TOMATOKENS, TOMATOKEN_REWARD, "");
		emit TomatokenRewarded(msg.sender, TOMATOKEN_REWARD);
	}

	function getInventoryOf(address from) public view returns(Asset[] memory) {
		return NFTownership[from];
	}

	function buyNFTomato(uint tomatoId) public payable {
		require(uint(msg.value) == 1 ether, "Only accepting the full price");
		_safeTransferFrom(address(this), msg.sender, tomatoId, 1, "");
		Asset memory newAsset = Asset(tomatoId, 1);
		NFTownership[msg.sender].push(newAsset);
		for (uint i; i < NFTownership[address(this)].length; i++) {
			if (NFTownership[address(this)][i].assetId == tomatoId) {
				delete NFTownership[address(this)][i];
				break;
			}
		}
		emit NFTomatoBought(msg.sender, tomatoId);
	}
}


