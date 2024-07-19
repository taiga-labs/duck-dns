

import { sleep } from '@ton/blueprint';
import { mnemonicToWalletKey } from '@ton/crypto';
import * as addresses from '../helpers/addresses';
import { ENDPOINT, TON_CENTER_API_KEY } from '../helpers/connection';
import { beginCell, MessageRelaxed, TonClient, WalletContractV4 } from '@ton/ton';
import { JETTON_TRANSFER_COMISSION, sendJettonsSerealize, } from './interface/sending';


const jettonAmount: bigint = 30000n;
const WALELT_MNEMONIC: string = "acoustic wheat coconut quantum fiscal note arena rough until caught guard safe rabbit wave major truly chaos song pelican guitar music certain cover speak";


export async function release_domain() {

    const client = new TonClient({
        endpoint: ENDPOINT,
        apiKey: TON_CENTER_API_KEY
    });

    
    const key = await mnemonicToWalletKey(WALELT_MNEMONIC.split(" "));
    const wallet = WalletContractV4.create({ publicKey: key.publicKey, workchain: 0 });
    const my_address = wallet.address;

    const walletContract = client.open(wallet);
    const seqno = await walletContract.getSeqno();

    console.log("[SEQNO] -->", seqno);
    
    const message: MessageRelaxed = await sendJettonsSerealize(
        my_address.toString(), 
        jettonAmount,
        JETTON_TRANSFER_COMISSION,
        beginCell().storeUint(0x4ed14b65, 32).endCell(),
        addresses.DNS_ITEM_ADDRESS,
        0,
        client
    );

    await sleep(3000);

    await walletContract.sendTransfer({
        secretKey: key.secretKey,
        seqno: seqno,
        messages: [
            message
        ]   
    });

    let currentSeqno = seqno;
    while (currentSeqno == seqno) {
        console.log("waiting for transaction to confirm...");
        await sleep(2000);
        currentSeqno = await walletContract.getSeqno();
    }
    console.log("transaction confirmed!")
}

release_domain();
