
import { toSha256 } from '../helpers/hashing';
import { Address, beginCell, Cell, Contract, ContractProvider, Sender, SendMode, TupleItemInt, TupleItemSlice } from '@ton/core';


export class DnsItem implements Contract {
    constructor(readonly address: Address, readonly init?: { code: Cell; data: Cell }) {}

    static createFromAddress(address: Address) {
        return new DnsItem(address);
    }

    async sendDeploy(provider: ContractProvider, via: Sender, value: bigint) {
        await provider.internal(via, {
            value,
            sendMode: SendMode.PAY_GAS_SEPARATELY,
            body: beginCell().endCell(),
        });
    }

    async sendAddDnsRecord(provider: ContractProvider, via: Sender, 
        options: {
            value: bigint;
            queryId: bigint;
            newCategory: string;
            newMapValue: Cell;
        }
    ) {
        await provider.internal(via, {
            value: options.value,
            sendMode: SendMode.PAY_GAS_SEPARATELY,
            body: 
                beginCell()
                    .storeUint(0x4eb1f0f9, 32)
                    .storeUint(options.queryId, 64)
                    .storeUint(toSha256(options.newCategory), 256)
                    .storeRef(options.newMapValue)
                .endCell(),
        });
    }

    async sendDeleteDnsRecord(provider: ContractProvider, via: Sender, 
        options: {
            value: bigint;
            queryId: bigint;
            newCategory: string;
        }
    ) {
        await provider.internal(via, {
            value: options.value,
            sendMode: SendMode.PAY_GAS_SEPARATELY,
            body: 
                beginCell()
                    .storeUint(0x4eb1f0f9, 32)
                    .storeUint(options.queryId, 64)
                    .storeUint(toSha256(options.newCategory), 256)
                .endCell(),
        });
    }

    async sendChangeCode(provider: ContractProvider, via: Sender, 
        options: {
            value: bigint;
            queryId: bigint;
            newCode: Cell;
        }
    ) {
        await provider.internal(via, {
            value: options.value,
            sendMode: SendMode.PAY_GAS_SEPARATELY,
            body: 
                beginCell()
                    .storeUint(0xab5fc32, 32)
                    .storeUint(options.queryId, 64)
                    .storeRef(options.newCode)
                .endCell(),
        });
    }

    async getDomain(provider: ContractProvider): Promise<string> {
        const result = await provider.get("get_domain", []);
        return result.stack.readString()
    }

    async getLastFillUpTime(provider: ContractProvider): Promise<bigint> {
        const result = await provider.get("get_last_fill_up_time", []);
        return result.stack.readBigNumber()
    }
    
    async getAuctionInfo(provider: ContractProvider): Promise<[Address | null, bigint, bigint]> {
        const result = await provider.get("get_auction_info", []);
        return [
            result.stack.readAddressOpt(),
            result.stack.readBigNumber(),
            result.stack.readBigNumber(),
        ]
    }

    async getDnsresolve(provider: ContractProvider, 
        options: {
            subdomain: string;
            category: bigint;
        }
    ): Promise<[bigint, Cell | null]> {
        const result = await provider.get("dnsresolve", [
            {
                type: 'slice',
                cell: 
                    beginCell()
                        .storeUint(0, 8)
                        .storeStringTail(options.subdomain)
                        .storeUint(0, 8)
                    .endCell()
            } as TupleItemSlice,
            {
                type: 'int',
                value: options.category,
            } as TupleItemInt
        ]);
        return [
            result.stack.readBigNumber(),
            result.stack.readCellOpt(),
        ]
    }


    async getNftData(provider: ContractProvider): Promise<[bigint, bigint, Address | null, Address | null, Cell]> {
        const result = await provider.get("get_nft_data", []);
        return [
            result.stack.readBigNumber(),
            result.stack.readBigNumber(),
            result.stack.readAddressOpt(),
            result.stack.readAddressOpt(),
            result.stack.readCell()
        ];
    }
}
