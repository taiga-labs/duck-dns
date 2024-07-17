
import { Address, Cell } from '@ton/core';
import { DnsItem } from '../../wrappers/DnsItem';
import { NetworkProvider } from '@ton/blueprint';
import { DNS_ITEM_ADDRESS } from './constants/addresses';


export async function run(provider: NetworkProvider) {
    const dnsItem = provider.open(DnsItem.createFromAddress(Address.parse(DNS_ITEM_ADDRESS)));

    const result: [Address | null, bigint, bigint] = await dnsItem.getAuctionInfo();
    
    console.log("[MAX BID ADDRESS] -->", result[0])
    console.log("[MAX BID AMOUNT] -->", result[1])
    console.log("[AUCTION END TIME] -->", result[2])
}

