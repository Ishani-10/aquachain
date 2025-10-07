import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";
import { Contract } from "ethers";

/**
 * Deploys the CarbonRegistry contract
 * @param hre HardhatRuntimeEnvironment object.
 */
const deployCarbonRegistry: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { deployer } = await hre.getNamedAccounts();
  const { deploy } = hre.deployments;

  await deploy("CarbonRegistry", {
    from: deployer,
    // Contract constructor arguments
    args: [], // Your CarbonRegistry constructor is empty, so no args are needed.
    log: true,
    // autoMine: can be passed to the deploy function to make the deployment process faster on local networks by
    // automatically mining the transaction immediately after sending it.
    autoMine: true,
  });

  // You don't need to get the contract instance here for deployment,
  // but it's useful if you wanted to interact with it immediately after.
  // const carbonRegistry = await hre.ethers.getContract<Contract>("CarbonRegistry", deployer);
  // console.log("👋 Initial greeting:", await carbonRegistry.greeting());
};

export default deployCarbonRegistry;

// Tags are useful for running specific deployment scripts selectively.
deployCarbonRegistry.tags = ["CarbonRegistry"];