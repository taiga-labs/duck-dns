
import { Address, beginCell, Cell, Contract, contractAddress, ContractProvider, Sender, SendMode, TupleItemInt, TupleItemSlice } from '@ton/core';

export type RootDnsConfig = {
    rootDomainMinter: Address
};

export function rootDnsConfigToCell(config: RootDnsConfig): Cell {
    return (
        beginCell()
            .storeAddress(config.rootDomainMinter)
        .endCell()
    );
}

export class RootDns implements Contract {
    constructor(readonly address: Address, readonly init?: { code: Cell; data: Cell }) {}

    static createFromAddress(address: Address) {
        return new RootDns(address);
    }

    static createFromConfig(config: RootDnsConfig, code: Cell, workchain = 0) {
        const data = rootDnsConfigToCell(config);
        const init = { code, data };
        return new RootDns(contractAddress(workchain, init), init);
    }

    async sendDeploy(provider: ContractProvider, via: Sender, value: bigint) {
        await provider.internal(via, {
            value,
            sendMode: SendMode.PAY_GAS_SEPARATELY,
            body: beginCell().endCell(),
        });
    }

    async getDnsresolve(provider: ContractProvider, 
        options: {
            domainCell: Cell
            category: bigint;
        }
    ): Promise<[bigint, Cell]> {
        const result = await provider.get("dnsresolve", [
            {
                type: 'slice',
                cell: options.domainCell
            } as TupleItemSlice,
            {
                type: 'int',
                value: options.category,
            } as TupleItemInt
        ]);
        return [
            result.stack.readBigNumber(),
            result.stack.readCell(),
        ]
    }
}
