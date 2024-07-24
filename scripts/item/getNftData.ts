
import { Address } from '@ton/core';
import { DnsItem } from '../../wrappers/DnsItem';
import { NetworkProvider } from '@ton/blueprint';
import { DNS_ITEM_ADDRESS } from '../../helpers/addresses';


export async function run(provider: NetworkProvider) {
    const dnsItem = provider.open(DnsItem.createFromAddress(Address.parse(DNS_ITEM_ADDRESS)));

    const result: [bigint, bigint, Address | null, Address | null] = await dnsItem.getNftData();
    
    console.log("[INIT?] -->", result[0])
    console.log("[INDEX] -->", result[1])
    console.log("[COLLECTION ADDRESS] -->", result[2])
    console.log("[OWNER ADDRESS] -->", result[3])
}

