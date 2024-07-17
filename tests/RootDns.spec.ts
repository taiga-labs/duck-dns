import { Blockchain, SandboxContract, TreasuryContract } from '@ton/sandbox';
import { Cell, toNano } from '@ton/core';
import { RootDns } from '../wrappers/RootDns';
import '@ton/test-utils';
import { compile } from '@ton/blueprint';

describe('RootDns', () => {
    let code: Cell;

    beforeAll(async () => {
        code = await compile('RootDns');
    });

    let blockchain: Blockchain;
    let deployer: SandboxContract<TreasuryContract>;
    let rootDns: SandboxContract<RootDns>;

    beforeEach(async () => {
        blockchain = await Blockchain.create();

        rootDns = blockchain.openContract(RootDns.createFromConfig({}, code));

        deployer = await blockchain.treasury('deployer');

        const deployResult = await rootDns.sendDeploy(deployer.getSender(), toNano('0.05'));

        expect(deployResult.transactions).toHaveTransaction({
            from: deployer.address,
            to: rootDns.address,
            deploy: true,
            success: true,
        });
    });

    it('should deploy', async () => {
        // the check is done inside beforeEach
        // blockchain and rootDns are ready to use
    });
});
