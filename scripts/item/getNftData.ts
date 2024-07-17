
import { DnsItem } from '../../wrappers/DnsItem';
import { NetworkProvider } from '@ton/blueprint';
import { Address, Cell, Dictionary, Slice } from '@ton/core';
import { DNS_ITEM_ADDRESS } from './constants/addresses';
import { toSha256 } from '../../helpers/hashing';


export async function run(provider: NetworkProvider) {
    const dnsItem = provider.open(DnsItem.createFromAddress(Address.parse(DNS_ITEM_ADDRESS)));

    const result: [bigint, bigint, Address | null, Address | null, Cell] = await dnsItem.getNftData();
    
    console.log("[INIT?] -->", result[0])
    console.log("[INDEX] -->", result[1])
    console.log("[COLLECTION ADDRESS] -->", result[2])
    console.log("[OWNER ADDRESS] -->", result[3])
    
    try { 
        
        let content = result[4].beginParse();
        const onchainPrefix = content.loadUint(8);
        if (onchainPrefix == 0) {
            const categoriesDictionary = content.loadDict(Dictionary.Keys.BigUint(256), Dictionary.Values.Cell())

            const keys = categoriesDictionary.keys()
            const values = categoriesDictionary.values()
        
            for (let iter: number = 0; iter < keys.length; iter += 1) {
                let slicedValue: Slice = values[iter].beginParse();
                let prefix: number = slicedValue.loadUint(16);
                let address: Address = slicedValue.loadAddress();
                console.log(/*"[KEY] -->", keys[iter], "|", */"[PREFIX] -->", `0x${prefix.toString(16)}`, "|", "[ADDRESS] -->", address);
            }
        }
        
    }
    catch(Error) {
        console.log(Error)
    }

}

