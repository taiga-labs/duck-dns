import { Address, toNano } from '@ton/core';
import { RootDns } from '../../wrappers/RootDns';
import { compile, NetworkProvider } from '@ton/blueprint';

export async function run(provider: NetworkProvider) {
    const rootDns = provider.open(RootDns.createFromConfig({
        rootDomainMinter: Address.parse("EQDhcL6BRi5SMrcz06Tj37hVNjDG1U8LkGIFUpy86JKkrf1W")
    }, await compile('RootDns')));

    await rootDns.sendDeploy(provider.sender(), toNano('0.05'));
    await provider.waitForDeploy(rootDns.address);
}
