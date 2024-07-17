import { Blockchain, SandboxContract, TreasuryContract } from '@ton/sandbox';
import { Cell, toNano } from '@ton/core';
import { DnsItem } from '../wrappers/DnsItem';
import '@ton/test-utils';
import { compile } from '@ton/blueprint';

describe('DnsItem', () => {
    let code: Cell;

    beforeAll(async () => {
        code = await compile('DnsItem');
    });

    let blockchain: Blockchain;
    let deployer: SandboxContract<TreasuryContract>;
    let dnsItem: SandboxContract<DnsItem>;

    beforeEach(async () => {
        blockchain = await Blockchain.create();

        dnsItem = blockchain.openContract(DnsItem.createFromConfig({}, code));

        deployer = await blockchain.treasury('deployer');

        const deployResult = await dnsItem.sendDeploy(deployer.getSender(), toNano('0.05'));

        expect(deployResult.transactions).toHaveTransaction({
            from: deployer.address,
            to: dnsItem.address,
            deploy: true,
            success: true,
        });
    });

    it('should deploy', async () => {
        // the check is done inside beforeEach
        // blockchain and dnsItem are ready to use
    });
});
