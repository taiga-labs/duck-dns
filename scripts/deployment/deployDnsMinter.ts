
import { DnsMinter } from '../../wrappers/DnsMinter';
import { Address, beginCell, toNano } from '@ton/core';
import { compile, NetworkProvider } from '@ton/blueprint';
import  * as addresses from '../../helpers/addresses';
import { buildCollectionContentCell } from '.././nftContent/onChain';
import { calculateJettonWalletCodeWithClient } from '../../helpers/tonclient';


export async function run(provider: NetworkProvider) {

    const duck_jetton_wallet_code = await calculateJettonWalletCodeWithClient(addresses.DUCK_MINTER_ADDRESS);
    
    const dnsMinter = provider.open(DnsMinter.createFromConfig({
        collectionContent: buildCollectionContentCell({
            name: "DUCK DNS Domains!",
            description: "*.duck domains",
            image: "https://cache.tonapi.io/imgproxy/kxmx0kWpNNKRyoqkyETfLnR46K-uioZ3AkfPRb2a2zg/rs:fill:200:200:1/g:no/aHR0cHM6Ly9naXRodWIuY29tL0R1Y2tNaXplbC9EdWNrQ29pbi9ibG9iL21haW4vZHVjay5wbmc_cmF3PXRydWU.webp"
        }),
        nftItemCode: await compile('DnsItem'),
        adminAddress: Address.parse("0QANsjLvOX2MERlT4oyv2bSPEVc9lunSPIs5a1kPthCXydUX"),
        duckJettonInfo: 
            beginCell()
                .storeAddress(Address.parse(addresses.DUCK_MINTER_ADDRESS))
                .storeRef(duck_jetton_wallet_code)
            .endCell()
    }, await compile('DnsMinter')));

    await dnsMinter.sendDeploy(provider.sender(), toNano('0.05'));
    await provider.waitForDeploy(dnsMinter.address);
}
