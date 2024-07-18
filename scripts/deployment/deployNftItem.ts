
import { Address, toNano } from '@ton/core';
import { NetworkProvider } from '@ton/blueprint';
import * as addresses from '../../helpers/addresses';
import { DnsMinter } from '../../wrappers/DnsMinter';

export async function run(provider: NetworkProvider) {
    const dnsMinter = provider.open(DnsMinter.createFromAddress(Address.parse(addresses.DUCK_DOMAIN_NAMES_MINTER)));

    await dnsMinter.sendDeployNftItem(provider.sender(), {
        value: toNano('1'),
        newDomain: "hello-world-yes"
    });
}
