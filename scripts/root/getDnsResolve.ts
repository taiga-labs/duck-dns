
import { Address, Cell } from '@ton/core';
import { RootDns } from '../../wrappers/RootDns';
import { NetworkProvider } from '@ton/blueprint';
import { ROOT_DNS_ADDRESS } from '../../helpers/addresses';


export async function run(provider: NetworkProvider) {
    const rootDns = provider.open(RootDns.createFromAddress(Address.parse(ROOT_DNS_ADDRESS)));

    const result: [bigint, Cell | null] = await rootDns.getDnsresolve({
        subdomain: "duck",
        category: 0n
    });

    console.log("[NUMBER] -->", result[0]);
    
    const slicedDnsRecord = result[1]?.beginParse();
    const prefix: number | undefined = slicedDnsRecord?.loadUint(16);
    const address: Address | undefined = slicedDnsRecord?.loadAddress();

    console.log("[PREFIX] -->", `0x${prefix?.toString(16)}`)
    console.log("[ADDRESS] -->", address) // адрес DNS резолвера относительно уже any.duck
}

