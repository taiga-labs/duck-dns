
import { NetworkProvider } from '@ton/blueprint';
import * as addresses from '../../helpers/addresses';
import { DnsMinter } from '../../wrappers/DnsMinter';
import { Address, beginCell, toNano } from '@ton/core';
import { calculateJettonWalletAddressWithClient } from '../../helpers/tonclient';

const TON_AMOUNT_TO_WITHDRAW: number = 1;
const TO_ADDRESS: string = "0QANsjLvOX2MERlT4oyv2bSPEVc9lunSPIs5a1kPthCXydUX";

export async function run(provider: NetworkProvider) {

    const dnsMinter = provider.open(DnsMinter.createFromAddress(Address.parse(addresses.DUCK_DOMAIN_NAMES_MINTER)));
    await dnsMinter.sendAdminJettonWithdraw(provider.sender(), {
        value: toNano("0.015"),
        mode: 1,
        payload:
            beginCell()
                .storeUint(0x18, 6)
                .storeAddress(Address.parse(TO_ADDRESS))
                .storeCoins(toNano(TON_AMOUNT_TO_WITHDRAW) + toNano("0.015"))
                .storeUint(0, 1 + 4 + 4 + 64 + 32 + 1 + 1)
            .endCell()
    })          
}

