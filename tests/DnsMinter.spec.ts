import { Blockchain, SandboxContract, TreasuryContract } from '@ton/sandbox';
import { Cell, toNano } from '@ton/core';
import { DnsMinter } from '../wrappers/DnsMinter';
import '@ton/test-utils';
import { compile } from '@ton/blueprint';

describe('DnsMinter', () => {
    let code: Cell;

    beforeAll(async () => {
        code = await compile('DnsMinter');
    });

    let blockchain: Blockchain;
    let deployer: SandboxContract<TreasuryContract>;
    let dnsMinter: SandboxContract<DnsMinter>;

    beforeEach(async () => {
        blockchain = await Blockchain.create();

        dnsMinter = blockchain.openContract(DnsMinter.createFromConfig({}, code));

        deployer = await blockchain.treasury('deployer');

        const deployResult = await dnsMinter.sendDeploy(deployer.getSender(), toNano('0.05'));

        expect(deployResult.transactions).toHaveTransaction({
            from: deployer.address,
            to: dnsMinter.address,
            deploy: true,
            success: true,
        });
    });

    it('should deploy', async () => {
        // the check is done inside beforeEach
        // blockchain and dnsMinter are ready to use
    });
});
