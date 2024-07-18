
import { Address, Cell } from '@ton/core';
import { DnsMinter } from '../../wrappers/DnsMinter';
import { NetworkProvider } from '@ton/blueprint';
import { DUCK_DOMAIN_NAMES_MINTER } from '../../helpers/addresses';

export async function run(provider: NetworkProvider) {
    const dnsMinter = provider.open(DnsMinter.createFromAddress(Address.parse(DUCK_DOMAIN_NAMES_MINTER)));
    const result: [number, Cell | null, Address | null] = await dnsMinter.getCollectionData();

    console.log("[INITED?] -->", result[0] == -1 ? true : false);
    console.log("[ADMIN ADDRESS] -->", result[2]);
}

