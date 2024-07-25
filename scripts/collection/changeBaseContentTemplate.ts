
import { Address, toNano } from '@ton/core';
import { DnsMinter } from '../../wrappers/DnsMinter';
import { NetworkProvider } from '@ton/blueprint';
import { DUCK_DOMAIN_NAMES_MINTER } from '../../helpers/addresses';
export async function run(provider: NetworkProvider) {

    const dnsMinter = provider.open(DnsMinter.createFromAddress(Address.parse(DUCK_DOMAIN_NAMES_MINTER)));
    
    await dnsMinter.sendChangeBaseContentTemplate(provider.sender(), {
        value: toNano("0.05"),
        new_description: "A .duck blockchain domain.",
        new_base_path: "https://i.ibb.co/r2JQng9/"
    })
}

