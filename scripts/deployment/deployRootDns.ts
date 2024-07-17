import { Address, toNano } from '@ton/core';
import { RootDns } from '../../wrappers/RootDns';
import { compile, NetworkProvider } from '@ton/blueprint';

export async function run(provider: NetworkProvider) {
    const rootDns = provider.open(RootDns.createFromConfig({
        rootDomainMinter: Address.parse("kQD7hUJF6RNbSI_iP_efnnE76fn281Tcwi1dDRoPS0atGTmK")
    }, await compile('RootDns')));

    await rootDns.sendDeploy(provider.sender(), toNano('0.05'));
    await provider.waitForDeploy(rootDns.address);
}
