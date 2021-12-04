# Tomatoken

This is a very complete example of several blockchain technologies applications. In this project I create the Tomatoken, a token that will be used to reward users for successfully finishing pomodoros on the site. With Tomatokens they can buy the NFTomatoes that we mint on creation of the contract. The user can buy Tomatokens too using Etherium, but only a maximum amount per day.

## NFTs generation

To generate the NFTomatoes, we use the generator found here: https://github.com/NotLuksus/nft-art-generator

The source of the NFTs are in the `nft-sources` folder, separated by layers (background, body, eyes). This generator creates the image files and the json metadata files in the `output` folder

The commands for installing the generator and how to use it can be found in the generator readme file.

## NFTs upload

We upload the NFTs to IPFS using the Web3.Storage API. For that you need to go to https://web3.storage/ and create and account. Then create an API for this project and, after generated the NFTomatoes in the `output` folder, run this command:

```
node nft-upload.js --token=<YOUR_API_TOKEN>
```

NOTE: you will need to put `"type": "module"` in the `package.json` file for this to work, and remove it after this step is done.

It will upload the files into IPFS and give you a CID.

Each NFTomato image will be located in `https://[CID].ipfs.dweb.link/output/[0 based index of the NFTomato].png`
Each NFTomato json metadata file will be located in `https://[CID].ipfs.dweb.link/output/metadata/[0 based index of the NFTomato]` (without the json extension)

## Setting up the contract

Once you have the CID of the metadata, you have to edit the constructor of the contract with the url `https://[CID].ipfs.dweb.link/metadata/{id}` (without the json extension) using the CID given in the last step. Leave the `{id}` part of the url as is.
