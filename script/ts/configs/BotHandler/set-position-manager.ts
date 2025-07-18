import { BotHandler__factory } from "../../../../typechain";
import { loadConfig } from "../../utils/config";
import { Command } from "commander";
import signers from "../../entities/signers";
import SafeWrapper from "../../wrappers/SafeWrapper";

async function main(chainId: number) {
  const positionManagers = ["0xd7BfD4F9de8016C0A28FD1AA8A3AcbA460563492"];
  const isAllow = true;

  const config = loadConfig(chainId);
  const deployer = signers.deployer(chainId);
  const safeWrapper = new SafeWrapper(chainId, config.safe, deployer);
  const botHandler = BotHandler__factory.connect(config.handlers.bot, deployer);

  console.log("[configs/BotHandler] Proposing tx to set position managers");
  const tx = await safeWrapper.proposeTransaction(
    botHandler.address,
    0,
    botHandler.interface.encodeFunctionData("setPositionManagers", [positionManagers, isAllow])
  );
  console.log(`[configs/BotHandler] Proposed: ${tx}`);
}

const prog = new Command();

prog.requiredOption("--chain-id <number>", "chain id", parseInt);

prog.parse(process.argv);

const opts = prog.opts();

main(opts.chainId).catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
