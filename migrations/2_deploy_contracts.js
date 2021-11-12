var Tomatoken = artifacts.require("./Tomatoken.sol");

module.exports = function (deployer) {
  deployer.deploy(Tomatoken);
};
