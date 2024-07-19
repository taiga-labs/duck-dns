

import { TonClient } from "@ton/ton";
import { DUCK_MINTER_ADDRESS } from "../../helpers/addresses";
import { calculateJettonWalletAddress } from "../../helpers/tonclient";
import { Address, beginCell, Cell, internal, MessageRelaxed, toNano } from "@ton/core";

export const DEPLOY_TON_AMOUNT: number = 0.5; // 0.5 TON
export const JETTON_TRANSFER_COMISSION: number = 0.05; // 0.05 TON

export async function sendJettonsSerealize( 
    userWalletAddress: string, 
    jettonAmount: bigint, 
    forwardTonAmountToDeploy: number,
    payload: Cell,
    toAddress: string,
    additionalFee: number,
    client: TonClient): Promise<MessageRelaxed> {

    const userJettonWalletAddress: string = await calculateJettonWalletAddress(Address.parse(DUCK_MINTER_ADDRESS), Address.parse(userWalletAddress), client); 

    return (
        internal({
            to: userJettonWalletAddress,
            value: toNano(forwardTonAmountToDeploy + JETTON_TRANSFER_COMISSION + additionalFee),
            body: 
                beginCell()
                    .storeUint(0xf8a7ea5, 32)
                    .storeUint(Math.floor(Date.now() / 1000), 64)
                    .storeCoins(toNano(jettonAmount))
                    .storeAddress(Address.parse(toAddress))
                    .storeUint(0, 2) // response address -- null
                    .storeUint(0, 1)
                    .storeCoins(toNano(forwardTonAmountToDeploy))
                    .storeUint(1, 1)
                    .storeRef(payload)
                .endCell(),
        })
    );

}