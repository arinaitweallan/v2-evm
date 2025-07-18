import { CrossMarginHandler__factory } from "../../../../typechain";
import { OwnerWrapper } from "../../wrappers/OwnerWrapper";
import signers from "../../entities/signers";
import { Command } from "commander";
import { loadConfig } from "../../utils/config";

const orderExecutor = "0xd7BfD4F9de8016C0A28FD1AA8A3AcbA460563492";
const isAllow = true;

async function main(chainId: number) {
  const deployer = signers.deployer(chainId);
  const ownerWrapper = new OwnerWrapper(chainId, deployer);
  const config = loadConfig(chainId);

  console.log("> CrossMarginHandler: Set Order Executor...");
  const crossMarginHandler = CrossMarginHandler__factory.connect(config.handlers.crossMargin, deployer);
  await ownerWrapper.authExec(
    crossMarginHandler.address,
    crossMarginHandler.interface.encodeFunctionData("setOrderExecutor", [orderExecutor, isAllow])
  );
  console.log("> CrossMarginHandler: Set Order Executor success!");
}

const program = new Command();

program.requiredOption("--chain-id <chainId>", "chain id", parseInt);

program.parse(process.argv);

const opts = program.opts();

main(opts.chainId).catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
