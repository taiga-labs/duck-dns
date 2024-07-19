
import { DnsItem } from '../../wrappers/DnsItem';
import { NetworkProvider } from '@ton/blueprint';
import { Address, beginCell, Cell, toNano } from '@ton/core';
import { DNS_ITEM_ADDRESS } from '../../helpers/addresses';

function seralizedDnsNextResolver(address: string): Cell {
    return (
        beginCell()
            .storeUint(0xba93, 16) // dns next resolver prefix
            .storeAddress(Address.parse(address))
        .endCell()
    )
}

function seralizedDnsSmcAddress(address: string): Cell {
    return (
        beginCell()
            .storeUint(0x9fd3, 16) // dns smc address prefix
            .storeAddress(Address.parse(address))
            .storeUint(0, 1) // empty Proto List
        .endCell()
    )
}

export async function run(provider: NetworkProvider) {
    const dnsItem = provider.open(DnsItem.createFromAddress(Address.parse(DNS_ITEM_ADDRESS)));

    await dnsItem.sendAddDnsRecord(provider.sender(), {
        value: toNano("0.05"),
        queryId: BigInt(Math.floor(Date.now() / 1000)),
        newCategory: "dns_next_resolver",
        newMapValue: seralizedDnsNextResolver("EQANsjLvOX2MERlT4oyv2bSPEVc9lunSPIs5a1kPthCXyTNY")
    });
}

