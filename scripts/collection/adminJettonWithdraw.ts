
import { TonClient } from '@ton/ton';
import { ENDPOINT } from '../../helpers/tonclient';
import { DnsMinter } from '../../wrappers/DnsMinter';
import { NetworkProvider, sleep } from '@ton/blueprint';
import * as addresses from '../../helpers/addresses';
import { Address, beginCell, toNano, TupleItemSlice } from '@ton/core';

const JETTON_TRANSFER_COMISSION = 0.05;
const TO_ADDRESS: Address = Address.parse("0QANsjLvOX2MERlT4oyv2bSPEVc9lunSPIs5a1kPthCXydUX");

export async function calculateJettonWalletAddressWithClient(minterAddress: string, ownerAddress: string): Promise<string> {

    await sleep(1500);

    const client = new TonClient({
        endpoint: ENDPOINT,
    });

    await sleep(1500);

    const response = await client.runMethod(Address.parse(minterAddress), "get_wallet_address", [
        {
            type: 'slice',
            cell: 
                beginCell()
                    .storeAddress(Address.parse(ownerAddress))
                .endCell()
        } as TupleItemSlice
    ])
    return response.stack.readAddress().toString();
}


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
                .storeCoins(toNano(10)) // jetton amount
                .storeAddress(TO_ADDRESS)
                .storeUint(0, 2)
                .storeUint(0, 1)
                .storeCoins(0)
                .storeUint(0, 1)
            .endCell()
    })          
}

