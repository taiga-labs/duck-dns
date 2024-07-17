
import { Address, Cell } from '@ton/core';
import { DnsItem } from '../../wrappers/DnsItem';
import { NetworkProvider } from '@ton/blueprint';
import { DNS_ITEM_ADDRESS } from './constants/addresses';


export async function run(provider: NetworkProvider) {
    const dnsItem = provider.open(DnsItem.createFromAddress(Address.parse(DNS_ITEM_ADDRESS)));

    const result: [bigint, Cell | null] = await dnsItem.getDnsresolve({
        subdomain: "taiga",
        category: 0n
    });

    console.log("[NUMBER] -->", result[0]);
    
    const slicedDnsRecord = result[1]?.beginParse();
    const prefix: number | undefined = slicedDnsRecord?.loadUint(16);
    const address: Address | undefined = slicedDnsRecord?.loadAddress();

    console.log("[PREFIX] -->", `0x${prefix?.toString(16)}`)
    console.log("[ADDRESS] -->", address) // адрес DNS резолвера относительно уже any.duck
}

