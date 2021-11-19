const { disconnect } = require("process");

const Tomatoken = artifacts.require("./Tomatoken.sol");

const BN = web3.utils.BN;

contract("Tomatoken", async (accounts) => {
  const [initialHolder, recipient, anotherAccount] = accounts;

  it("Contract starts with all the tokens", async () => {
    const instance = await Tomatoken.deployed();
    const balance = await instance.balanceOf.call(instance.address, 0);
    assert.deepEqual(balance.toString(), new BN((10 ** 18).toString()).toString(), "The balance is wrong");
  });

  it("Tokens can be bought with full price", async () => {
    const instance = await Tomatoken.deployed();
    const ownerBalance = await instance.balanceOf.call(instance.address, 0);
    let otherBalance = await instance.balanceOf.call(anotherAccount, 0);
    assert.deepEqual(otherBalance.toString(), new BN(0).toString(), "The balance is wrong");
    await instance.buyTokens({ from: anotherAccount, value: 10 ** 12 });
    otherBalance = await instance.balanceOf.call(anotherAccount, 0);
    assert.deepEqual(otherBalance.toString(), new BN(1).toString(), "The balance is wrong");
  });
});
