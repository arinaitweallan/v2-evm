import { ethers, run, upgrades, getChainId } from "hardhat";
import { loadConfig } from "../../utils/config";
import signers from "../../entities/signers";
import ProxyAdminWrapper from "../../wrappers/ProxyAdminWrapper";

async function main() {
  const chainId = Number(await getChainId());
  const config = loadConfig(chainId);
  const deployer = signers.deployer(chainId);
  const proxyAdminWrapper = new ProxyAdminWrapper(chainId, deployer);

  const ExternalRebalancer = await ethers.getContractFactory("ExternalRebalancer", deployer);
  const externalRebalancer = config.handlers.externalRebalancer;

  console.log(`[upgrade/ExternalRebalancer] Preparing to upgrade ExternalRebalancer`);
  const newImplementation = await upgrades.prepareUpgrade(externalRebalancer, ExternalRebalancer);
  console.log(`[upgrade/ExternalRebalancer] Done`);

  console.log(`[upgrade/ExternalRebalancer] New ExternalRebalancer Implementation address: ${newImplementation}`);
  await proxyAdminWrapper.upgrade(externalRebalancer, newImplementation.toString());
  console.log(`[upgrade/ExternalRebalancer] Upgraded!`);

  console.log(`[upgrade/ExternalRebalancer] Verify contract`);
  await run("verify:verify", {
    address: newImplementation.toString(),
    constructorArguments: [],
  });
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
