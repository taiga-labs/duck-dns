
import { Address, beginCell, Cell } from '@ton/core';
import { DnsMinter } from '../../wrappers/DnsMinter';
import { NetworkProvider } from '@ton/blueprint';
import { DUCK_DOMAIN_NAMES_MINTER } from '../../helpers/addresses';

export async function run(provider: NetworkProvider) {
    const dnsMinter = provider.open(DnsMinter.createFromAddress(Address.parse(DUCK_DOMAIN_NAMES_MINTER)));
    const result: [string, string, string] = await dnsMinter.getBaseContentTemplate();

    console.log("[BASE DOMAIN] -->", result[0]);
    console.log("[DESCRIPTION] -->", result[1]);
    console.log("[LINK PATH] -->", result[2]);
}

