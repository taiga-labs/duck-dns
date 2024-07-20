
import { Address, beginCell, Builder, Cell } from '@ton/core';
import { RootDns } from '../../wrappers/RootDns';
import { NetworkProvider } from '@ton/blueprint';
import { ROOT_DNS_ADDRESS } from '../../helpers/addresses';


const DOMAIN_TO_RESOLVE: string = "taiga-labs.duck";


export async function run(provider: NetworkProvider) {
    const rootDns = provider.open(RootDns.createFromAddress(Address.parse(ROOT_DNS_ADDRESS)));

    let domainCell: Builder = beginCell().storeUint(0, 8);
    const domain = DOMAIN_TO_RESOLVE.split(".").reverse()

    domain.forEach((element) => {
        domainCell.storeStringTail(element).storeUint(0, 8)
    })

    const result: [bigint, Cell | null] = await rootDns.getDnsresolve({
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

