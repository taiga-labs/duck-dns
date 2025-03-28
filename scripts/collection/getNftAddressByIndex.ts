
import { Address } from '@ton/core';
import { DnsMinter } from '../../wrappers/DnsMinter';
import { NetworkProvider } from '@ton/blueprint';
import { DUCK_DOMAIN_NAMES_MINTER } from '../../helpers/addresses';
export async function run(provider: NetworkProvider) {
    const dnsMinter = provider.open(DnsMinter.createFromAddress(Address.parse(DUCK_DOMAIN_NAMES_MINTER)));
    const nfftItemAddress: Address | null = await dnsMinter.getNftAddressByIndex({
        index: 89686541272024019837287005240688357327050952092331621411795227106187036374287n // item index
    });
    console.log("[NFT ITEN ADDRESS] -->", nfftItemAddress)
}

