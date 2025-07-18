import { ethers } from "ethers";
import { OracleMiddleware__factory } from "../../../../typechain";
import { getConfig, loadConfig } from "../../utils/config";
import signers from "../../entities/signers";
import { Command } from "commander";
import { OwnerWrapper } from "../../wrappers/OwnerWrapper";

async function main(chainId: number) {
  const deployer = signers.deployer(chainId);
  const config = loadConfig(chainId);
  const oracle = OracleMiddleware__factory.connect(config.oracles.middleware, deployer);

  const updater = "0xd7BfD4F9de8016C0A28FD1AA8A3AcbA460563492";
  const isAllow = true;

  const ownerWrapper = new OwnerWrapper(chainId, deployer);

  console.log("> OracleMiddleware Set Updater...");
  await ownerWrapper.authExec(oracle.address, oracle.interface.encodeFunctionData("setUpdater", [updater, isAllow]));
  console.log("> OracleMiddleware Set Updater success!");
}

const program = new Command();

program.requiredOption("--chain-id <chainId>", "chain id", parseInt);

program.parse(process.argv);

const opts = program.opts();

main(opts.chainId).catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
