

import { Address, beginCell, Cell, Dictionary, Slice } from '@ton/core';
import { DnsItem } from '../../wrappers/DnsItem';
import { NetworkProvider } from '@ton/blueprint';
import { DNS_ITEM_ADDRESS } from '../../helpers/addresses';


export async function run(provider: NetworkProvider) {
    const dnsItem = provider.open(DnsItem.createFromAddress(Address.parse(DNS_ITEM_ADDRESS)));

    const result: [bigint, Cell | null] = await dnsItem.getDnsresolve({
        subdomain: "taiga-labs.duck",
        category: 0n
    });

    console.log("[NUMBER] -->", result[0]);
    
    try { 

        let slicedValue: Slice = result[1]!.beginParse();
        let prefix: number = slicedValue.loadUint(16);
        let address: Address = slicedValue.loadAddress();
        console.log(/*"[KEY] -->", keys[iter], "|", */"[PREFIX] -->", `0x${prefix.toString(16)}`, "|", "[ADDRESS] -->", address);
        
    }
    catch(Error) {
        console.log(Error)
    }
}



