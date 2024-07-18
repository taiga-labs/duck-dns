
import { sleep } from "@ton/blueprint";
import { Address, beginCell, Cell, TonClient, TupleItemSlice } from "@ton/ton";

export const ENDPOINT: string = "https://testnet.toncenter.com/api/v2/jsonRPC";

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

export async function calculateJettonWalletCodeWithClient(minterAddress: string): Promise<Cell> {

    await sleep(1500);

    const client = new TonClient({
        endpoint: ENDPOINT,
    });

    await sleep(1500);

    const response = await client.runMethod(Address.parse(minterAddress), "get_jetton_data", [])

    response.stack.readNumber(); response.stack.readNumber(); response.stack.readAddress(); response.stack.readCellOpt(); 
    return response.stack.readCell()
}