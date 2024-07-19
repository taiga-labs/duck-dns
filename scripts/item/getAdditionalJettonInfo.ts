
import { Address, fromNano } from '@ton/core';
import { DnsItem } from '../../wrappers/DnsItem';
import { NetworkProvider } from '@ton/blueprint';
import { DNS_ITEM_ADDRESS } from '../../helpers/addresses';


export async function run(provider: NetworkProvider) {
    const dnsItem = provider.open(DnsItem.createFromAddress(Address.parse(DNS_ITEM_ADDRESS)));

    const result: [Address, bigint] = await dnsItem.getAdditioanlJettonInfo();
    
    console.log("[SMC DUCK JETTON WALLET ADDRESS] -->", result[0])
    console.log("[SMC DUCK BALANCE] -->", fromNano(result[1]), "DUCK")
}

