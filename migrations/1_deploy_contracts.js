const AccessControl = artifacts.require("AccessControl");

module.exports = function(deployer, network, accounts) {
  deployer.deploy(AccessControl);
};
