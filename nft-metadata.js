import process from "process";
import minimist from "minimist";
import { Web3Storage, getFilesFromPath } from "web3.storage";
import fs from "fs";

const metadataFolder = "./output/metadata";
async function main() {
  const args = minimist(process.argv.slice(2));
  const cid = args.cid;
  const token = args.token;

  if (!token) {
    console.error("A token is needed. You can create one on https://web3.storage");
    return;
  }

  if (!cid) {
    console.error("A CID is needed. Have you done the nft upload step already?");
    return;
  }

  fs.readdirSync(metadataFolder).forEach((file) => {
    const filePath = `${metadataFolder}/${file}`;
    const metadata = JSON.parse(fs.readFileSync(filePath));
    metadata.image = `https://${cid}.ipfs.dweb.link/output/${file}.png`;
    fs.writeFileSync(filePath, JSON.stringify(metadata));
  });

  const storage = new Web3Storage({ token });

  const files = await getFilesFromPath("./output/metadata");
  const metadataCid = await storage.put(files);
  console.log("Metadata added with CID:", metadataCid);
}

main();
