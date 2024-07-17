
import { toSha256 } from '../../helpers/hashing';
import { Dictionary, beginCell, Cell } from '@ton/core';

export function toTextCell(s: string): Cell {
    return beginCell().storeUint(0, 8).storeStringTail(s).endCell()
}

export type collectionContent = {
    name: string,
    description: string,
    image: string
    // cover_image: string
}
export type itemContent = {
    name: string,
    description: string,
    image: string,
    // attributes: string
    // content_url: string
}

export function buildCollectionContentCell(content: collectionContent): Cell {
    const collectionContentDict = Dictionary.empty(Dictionary.Keys.BigUint(256), Dictionary.Values.Cell())
        .set(toSha256("name"), toTextCell(content.name))
        .set(toSha256("description"), toTextCell(content.description))
        .set(toSha256("image"), toTextCell(content.image))
        //.set(toSha256("cover_image"), toTextCell(content.cover_image));
    
    return beginCell() // need to fix 
            .storeUint(0,8)
            .storeDict(collectionContentDict)
            .endCell(); 
    }

export function setItemContentCell(content: itemContent): Cell {
    const itemContentDict = Dictionary.empty(Dictionary.Keys.BigUint(256), Dictionary.Values.Cell())
        .set(toSha256("name"), toTextCell(content.name))
        .set(toSha256("description"), toTextCell(content.description))
        .set(toSha256("image"), toTextCell(content.image))
        // .set(toSha256("content_url"), toTextCell(content.content_url))
        // .set(toSha256("attributes"), toTextCell(content.attributes))

        

    return beginCell()
            .storeUint(0, 8)
            .storeDict(itemContentDict)
            .endCell(); 
}