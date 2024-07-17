
import { Address, Cell } from '@ton/core';
import { DnsMinter } from '../../wrappers/DnsMinter';
import { NetworkProvider } from '@ton/blueprint';
import { DUCK_DOMAIN_NAMES_MINTER } from '../../helpers/addresses';

export async function run(provider: NetworkProvider) {
    const dnsMinter = provider.open(DnsMinter.createFromAddress(Address.parse(DUCK_DOMAIN_NAMES_MINTER)));

    const result: [bigint, Cell | null] = await dnsMinter.getDnsresolve({
        subdomain: "hello-world",
        category: 0n
    });

    console.log("[NUMBER] -->", result[0]);
    
    const slicedDnsRecord = result[1]?.beginParse();
    const prefix: number | undefined = slicedDnsRecord?.loadUint(16);
    const address: Address | undefined = slicedDnsRecord?.loadAddress();

    console.log("[PREFIX] -->", `0x${prefix?.toString(16)}`)
    console.log("[ADDRESS] -->", address) // адрес DNS резолвера относительно уже any.duck
}

