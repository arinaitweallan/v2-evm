import signers from "../../entities/signers";
import { Command } from "commander";
import { CrossMarginHandler__factory } from "../../../../typechain";
import { loadConfig } from "../../utils/config";
import { OwnerWrapper } from "../../wrappers/OwnerWrapper";

async function main(chainId: number) {
  const config = loadConfig(chainId);
  const deployer = signers.deployer(chainId);

  const users: Array<string> = [
    "0x86e3538CbcbAF124baaEb1D5175485d2F882a11b",
    "0xD8A58c0f66B562342d790cD0e33a8acDb567A4EE",
    "0xEDebE2E3b28246374F66230293C7C7D7354B11A4",
  ];
  const isBanned: Array<boolean> = [false, false, false];

  console.log("[configs/CrossMarginHandler] Set banlist");
  const crossMarginHandler = CrossMarginHandler__factory.connect(config.handlers.crossMargin, deployer);
  const ownerWrapper = new OwnerWrapper(chainId, deployer);
  await ownerWrapper.authExec(
    crossMarginHandler.address,
    crossMarginHandler.interface.encodeFunctionData("setBanlist", [users, isBanned])
  );
  console.log("[configs/CrossMarginHandler] Done");
}

const program = new Command();

program.requiredOption("--chain-id <chain-id>", "Chain ID", parseInt);

const opts = program.parse(process.argv).opts();

main(opts.chainId).catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
