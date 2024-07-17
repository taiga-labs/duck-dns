import { toNano } from '@ton/core';
import { DnsMinter } from '../../wrappers/DnsMinter';
import { compile, NetworkProvider } from '@ton/blueprint';
import { buildCollectionContentCell } from '.././nftContent/onChain';

export async function run(provider: NetworkProvider) {
    const dnsMinter = provider.open(DnsMinter.createFromConfig({
        collectionContent: buildCollectionContentCell({
            name: "DUCK DNS Domains!",
            description: "*.duck domains",
            image: "https://cache.tonapi.io/imgproxy/kxmx0kWpNNKRyoqkyETfLnR46K-uioZ3AkfPRb2a2zg/rs:fill:200:200:1/g:no/aHR0cHM6Ly9naXRodWIuY29tL0R1Y2tNaXplbC9EdWNrQ29pbi9ibG9iL21haW4vZHVjay5wbmc_cmF3PXRydWU.webp"
        }),
        nftItemCode: await compile('DnsItem')
    }, await compile('DnsMinter')));

    await dnsMinter.sendDeploy(provider.sender(), toNano('0.05'));
    await provider.waitForDeploy(dnsMinter.address);
}
