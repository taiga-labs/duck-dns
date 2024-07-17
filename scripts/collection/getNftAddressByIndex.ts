
import { Address } from '@ton/core';
import { DnsMinter } from '../../wrappers/DnsMinter';
import { NetworkProvider } from '@ton/blueprint';
import { DUCK_DOMAIN_NAMES_MINTER } from '../../helpers/addresses';

export async function run(provider: NetworkProvider) {
    const dnsMinter = provider.open(DnsMinter.createFromAddress(Address.parse(DUCK_DOMAIN_NAMES_MINTER)));

    const nfftItemAddress: Address | null = await dnsMinter.getNftAddressByIndex({
        index: "hello-world"
    });
    console.log("[NFT ITEN ADDRESS] -->", nfftItemAddress)
}

