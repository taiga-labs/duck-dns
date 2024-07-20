
import { NetworkProvider } from '@ton/blueprint';
import * as addresses from '../../helpers/addresses';
import { DnsMinter } from '../../wrappers/DnsMinter';
import { Address, beginCell, toNano } from '@ton/core';
import { calculateJettonWalletAddressWithClient } from '../../helpers/tonclient';

const JETTON_TRANSFER_COMISSION: number = 0.05;
const JETTON_AMOUNT_TO_WITHDRAW: number = 1000;
const TO_ADDRESS: Address = Address.parse("0QANsjLvOX2MERlT4oyv2bSPEVc9lunSPIs5a1kPthCXydUX");

export async function run(provider: NetworkProvider) {

    const dnsMinter = provider.open(DnsMinter.createFromAddress(Address.parse(addresses.DUCK_DOMAIN_NAMES_MINTER)));

    const minters_jetton_wallet = await calculateJettonWalletAddressWithClient(addresses.DUCK_MINTER_ADDRESS, addresses.DUCK_DOMAIN_NAMES_MINTER)
    
    await dnsMinter.sendAdminJettonWithdraw(provider.sender(), {
        value: toNano("0.05"),
        mode: 1,
        payload:
            beginCell()
                .storeUint(0x18, 6)
                .storeAddress(Address.parse(minters_jetton_wallet))
                .storeCoins(toNano(JETTON_TRANSFER_COMISSION))
                .storeUint(0, 1 + 4 + 4 + 64 + 32 + 1 + 1)
                .storeUint(0xf8a7ea5, 32)
                .storeUint(Math.floor(Date.now() / 1000), 64)
                .storeCoins(toNano(JETTON_AMOUNT_TO_WITHDRAW)) // jetton amount
                .storeAddress(TO_ADDRESS)
                .storeUint(0, 2)
                .storeUint(0, 1)
                .storeCoins(0)
                .storeUint(0, 1)
            .endCell()
    })          
}

