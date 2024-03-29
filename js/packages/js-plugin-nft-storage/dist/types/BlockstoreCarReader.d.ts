import { Blockstore } from 'ipfs-car/blockstore';
import type { CID } from 'multiformats';
/**
 * An implementation of the CAR reader interface that is backed by a blockstore.
 * @see https://github.com/nftstorage/nft.storage/blob/0fc7e4e73867c437eac54f75f58a808dd4581c47/packages/client/src/bs-car-reader.js
 */
export declare class BlockstoreCarReader {
    _version: number;
    _roots: CID[];
    _blockstore: Blockstore;
    constructor(roots: CID[], blockstore: Blockstore, version?: number);
    get version(): number;
    get blockstore(): Blockstore;
    getRoots(): Promise<CID[]>;
    has(cid: CID): Promise<boolean>;
    get(cid: CID): Promise<{
        cid: CID;
        bytes: Uint8Array;
    }>;
    blocks(): AsyncGenerator<import("@ipld/car/api").Block, void, unknown>;
    cids(): AsyncGenerator<CID, void, unknown>;
}
