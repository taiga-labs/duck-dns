import { Address, beginCell, Cell, Contract, contractAddress, ContractProvider, Sender, SendMode, Slice, TupleItemInt, TupleItemSlice } from '@ton/core';
import { toSha256 } from '../helpers/hashing';

export type DnsMinterConfig = {
    collectionContent: Cell;
    nftItemCode: Cell;
    adminAddress: Address;
    duckJettonInfo: Cell;
    baseContentTemplates: Cell;
};

export function dnsMinterConfigToCell(config: DnsMinterConfig): Cell {
    return (
        beginCell()
            .storeRef(config.collectionContent)
            .storeRef(config.nftItemCode)
            .storeAddress(config.adminAddress)
            .storeRef(config.duckJettonInfo)
            .storeRef(config.baseContentTemplates)
        .endCell()
    );
}

export class DnsMinter implements Contract {
    constructor(readonly address: Address, readonly init?: { code: Cell; data: Cell }) {}

    static createFromAddress(address: Address) {
        return new DnsMinter(address);
    }

    static createFromConfig(config: DnsMinterConfig, code: Cell, workchain = 0) {
        const data = dnsMinterConfigToCell(config);
        const init = { code, data };
        return new DnsMinter(contractAddress(workchain, init), init);
    }

    async sendDeploy(provider: ContractProvider, via: Sender, value: bigint) {
        await provider.internal(via, {
            value,
            sendMode: SendMode.PAY_GAS_SEPARATELY,
            body: 
                beginCell()
                    .storeUint(0x370fec51, 32)
                .endCell(),
        });
    }

    async sendChangeAdmin(provider: ContractProvider, via: Sender, 
        options: {
            value: bigint;
            newAdminAddress: Address;
        }
    ) {
        await provider.internal(via, {
            value: options.value,
            sendMode: SendMode.PAY_GAS_SEPARATELY,
            body: 
                beginCell()
                    .storeUint(2, 32)
                    .storeAddress(options.newAdminAddress)
                .endCell(),
        });
    }

    async sendAdminJettonWithdraw(provider: ContractProvider, via: Sender, 
        options: {
            value: bigint;
            mode: number;
            payload: Cell;
        }
    ) {
        await provider.internal(via, {
            value: options.value,
            sendMode: SendMode.PAY_GAS_SEPARATELY,
            body: 
                beginCell()
                    .storeUint(3, 32)
                    .storeRef(
                        beginCell()
                            .storeUint(options.mode, 8)
                            .storeRef(options.payload)
                        .endCell()
                    )
                .endCell(),
        });
    }

    async sendChangeBaseContentTemplate(provider: ContractProvider, via: Sender, 
        options: {
            value: bigint;
            new_description: string;
            new_base_path: string;
        }
    ) {
        await provider.internal(via, {
            value: options.value,
            sendMode: SendMode.PAY_GAS_SEPARATELY,
            body: 
                beginCell()
                    .storeUint(4, 32)
                    .storeRef(
                        beginCell()
                            .storeRef(
                                beginCell()
                                    .storeStringTail(options.new_description)
                                .endCell()
                            )
                            .storeRef(
                                beginCell()
                                    .storeStringTail(options.new_base_path) // image path
                                .endCell()
                            )    
                        .endCell()
                    )
                .endCell(),
        });
    }
    
    async getDnsresolve(provider: ContractProvider, 
        options: {
            domainCell: Cell;
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

    async getNftAddressByIndex(provider: ContractProvider, 
        options: {
            index: bigint
        }
    ): Promise<Address | null> {
        const result = await provider.get("get_nft_address_by_index", [
            {
                type: 'int',
                value: options.index,
            } as TupleItemInt
        ]);

        return result.stack.readAddressOpt()
        
    }

    async getCollectionData(provider: ContractProvider ): Promise<[number, Cell | null, Address | null]> {
        const result = await provider.get("get_collection_data", [ ]);
        return [
            result.stack.readNumber(),
            result.stack.readCellOpt(),
            result.stack.readAddressOpt(),
        ]
        
    }

    async getBaseContentTemplate(provider: ContractProvider ): Promise<[string, string, string]> {
        const result = await provider.get("get_base_content_template", [ ]);
        return [
            result.stack.readString(),
            result.stack.readString(),
            result.stack.readString(),
        ]
        
    }
}
