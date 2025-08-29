import { ethers, run } from "hardhat";
import {
  convertFacetAndSelectorsToString,
  DeployUpgradeTaskArgs,
  FacetsAndAddSelectors,
} from "../../../tasks/deployUpgrade";

import { varsForNetwork } from "../../../helpers/constants";
import { xpRelayerAddressBase } from "../../helperFunctions";

export async function upgradeForgeDiamondForPet() {
  console.log("Deploying forge pet fix");
  const c = await varsForNetwork(ethers);
  const facets: FacetsAndAddSelectors[] = [
    {
      facetName: "CollateralFacet",
      addSelectors: [
        "function redeployTokenEscrows(uint256[] calldata _tokenIds) external",
      ],
      removeSelectors: [],
    },
  ];

  const joined1 = convertFacetAndSelectorsToString(facets);

  const args1: DeployUpgradeTaskArgs = {
    diamondOwner: xpRelayerAddressBase,
    diamondAddress: c.aavegotchiDiamond!,
    facetsAndAddSelectors: joined1,
    useLedger: false,
    useRelayer: true,
    useMultisig: false,
    initAddress: ethers.constants.AddressZero,
    initCalldata: "0x",
  };

  await run("deployUpgrade", args1);
}

if (require.main === module) {
  upgradeForgeDiamondForPet()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error(error);
      process.exit(1);
    });
}
