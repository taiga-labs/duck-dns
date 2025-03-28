
import { Address, toNano } from '@ton/core';
import { DnsItem } from '../../wrappers/DnsItem';
import { NetworkProvider } from '@ton/blueprint';
import { DNS_ITEM_ADDRESS } from '../../helpers/addresses';

export async function run(provider: NetworkProvider) {
    const dnsItem = provider.open(DnsItem.createFromAddress(Address.parse(DNS_ITEM_ADDRESS)));

    await dnsItem.sendDeleteDnsRecord(provider.sender(), {
        value: toNano("0.05"),
        queryId: BigInt(Math.floor(Date.now() / 1000)),
        newCategory: "dns_next_resolver",
    });
}

