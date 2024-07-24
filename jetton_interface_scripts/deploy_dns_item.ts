

import { sleep } from '@ton/blueprint';
import { mnemonicToWalletKey } from '@ton/crypto';
import * as addresses from '../helpers/addresses';
import { ENDPOINT, TON_CENTER_API_KEY } from '../helpers/connection';
import { beginCell, MessageRelaxed, TonClient, WalletContractV4 } from '@ton/ton';
import { DEPLOY_TON_AMOUNT, JETTON_TRANSFER_COMISSION, sendJettonsSerealize, } from './interface/sending';
import { setItemContentCell } from '../scripts/nftContent/onChain';


// ссылка на картинку
const IMAGE_LINK: string = "https://i.ibb.co/Z1GLsct/cat.jpg";

const jettonAmount: bigint = 10000n;
const WALELT_MNEMONIC: string = "cushion unaware dune garbage soap recipe manual garment sorry mass raccoon punch pony rifle amazing grant panda casino indoor suspect alien orient thought vault";


export async function deploy_dns_item(newDomain: string) {

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
        (JETTON_TRANSFER_COMISSION * 2) + DEPLOY_TON_AMOUNT,
        beginCell().storeUint(0, 32).storeRef(setItemContentCell({
            name: `${newDomain}.duck`,
            description: `Duck domain name: ${newDomain}.duck`,
            image: IMAGE_LINK
        })).storeStringTail(newDomain).endCell(),
        addresses.DUCK_DOMAIN_NAMES_MINTER,
        0.02, // additional fee for collection contract
        client
    );

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

deploy_dns_item("taiga-labs-pro");
