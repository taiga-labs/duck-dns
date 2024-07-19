
import { Address } from '@ton/core';
import { DnsItem } from '../../wrappers/DnsItem';
import { NetworkProvider } from '@ton/blueprint';
import { DNS_ITEM_ADDRESS } from '../../helpers/addresses';


export async function run(provider: NetworkProvider) {
    const dnsItem = provider.open(DnsItem.createFromAddress(Address.parse(DNS_ITEM_ADDRESS)));

    const lastFillUpTime: bigint = await dnsItem.getLastFillUpTime();
    
    console.log("[LAST FILL UP TIME] -->", lastFillUpTime)
}

