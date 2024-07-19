
import { Address, toNano } from '@ton/core';
import { DnsItem } from '../../wrappers/DnsItem';
import { compile, NetworkProvider } from '@ton/blueprint';
import { DNS_ITEM_ADDRESS } from '../../helpers/addresses';

export async function run(provider: NetworkProvider) {
    const dnsItem = provider.open(DnsItem.createFromAddress(Address.parse(DNS_ITEM_ADDRESS)));

    await dnsItem.sendChangeCode(provider.sender(), {
        value: toNano("0.05"),
        queryId: BigInt(Math.floor(Date.now() / 1000)),
        newCode: await compile("")
    });
}

