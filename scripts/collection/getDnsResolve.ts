
import { NetworkProvider } from '@ton/blueprint';
import { DnsMinter } from '../../wrappers/DnsMinter';
import { Address, beginCell, Builder, Cell } from '@ton/core';
import { DUCK_DOMAIN_NAMES_MINTER } from '../../helpers/addresses';

const DOMAIN_TO_RESOLVE: string = "taiga-labs.duck";

export async function run(provider: NetworkProvider) {
    const dnsMinter = provider.open(DnsMinter.createFromAddress(Address.parse(DUCK_DOMAIN_NAMES_MINTER)));

    const domain = DOMAIN_TO_RESOLVE.split(".").reverse()

    let domainCell: Builder = beginCell().storeUint(0, 8).storeStringTail(domain[1]).storeUint(0, 8)

    const result: [bigint, Cell | null] = await dnsMinter.getDnsresolve({
        domainCell: domainCell.endCell(),
        category: 0n
    });

    console.log("[NUMBER] -->", result[0]);
    
    const slicedDnsRecord = result[1]?.beginParse();
    const prefix: number | undefined = slicedDnsRecord?.loadUint(16);
    const address: Address | undefined = slicedDnsRecord?.loadAddress();

    console.log("[PREFIX] -->", `0x${prefix?.toString(16)}`)
    console.log("[ADDRESS] -->", address) // адрес DNS резолвера относительно уже any.duck
}

