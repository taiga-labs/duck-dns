
import { Address, toNano } from '@ton/core';
import { DnsMinter } from '../../wrappers/DnsMinter';
import { NetworkProvider } from '@ton/blueprint';
import { DUCK_DOMAIN_NAMES_MINTER } from '../../helpers/addresses';
export async function run(provider: NetworkProvider) {

    const dnsMinter = provider.open(DnsMinter.createFromAddress(Address.parse(DUCK_DOMAIN_NAMES_MINTER)));
    
    await dnsMinter.sendChangeAdmin(provider.sender(), {
        value: toNano("0.05"),
        newAdminAddress: Address.parse("")
    })
}

