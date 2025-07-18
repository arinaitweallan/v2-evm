import { LimitTradeHandler__factory } from "../../../../typechain";
import { loadConfig } from "../../utils/config";
import { Command } from "commander";
import signers from "../../entities/signers";
import { OwnerWrapper } from "../../wrappers/OwnerWrapper";

async function main(chainId: number) {
  const config = loadConfig(chainId);
  const deployer = signers.deployer(chainId);
  const ownerWrapper = new OwnerWrapper(chainId, deployer);

  const orderExecutor = "0xd7BfD4F9de8016C0A28FD1AA8A3AcbA460563492";
  const isAllow = true;

  const limitTradeHandler = LimitTradeHandler__factory.connect(config.handlers.limitTrade, deployer);
  console.log(`[configs/LimitTradeHandler] Set Order Executor`);
  await ownerWrapper.authExec(
    limitTradeHandler.address,
    limitTradeHandler.interface.encodeFunctionData("setOrderExecutor", [orderExecutor, isAllow])
  );
  console.log("[configs/LimitTradeHandler] Finished");
}

const prog = new Command();

prog.requiredOption("--chain-id <number>", "chain id", parseInt);

prog.parse(process.argv);

const opts = prog.opts();

main(opts.chainId)
  .then(() => {
    process.exit(0);
  })
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  });
