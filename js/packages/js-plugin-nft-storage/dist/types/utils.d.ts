import type { Blockstore } from 'ipfs-car/blockstore';
import type { CID } from 'multiformats';
import { CarReader } from 'nft.storage';
import * as Block from 'multiformats/block';
import * as dagPb from '@ipld/dag-pb';
export declare type EncodedCar = {
    car: CarReader;
    cid: CID;
};
export declare type DagPbLink = dagPb.PBLink;
export declare type DagPbBlock = Block.Block<dagPb.PBNode>;
export declare const DEFAULT_GATEWAY_HOST = "https://nftstorage.link";
export declare function toGatewayUri(cid: string, path?: string, host?: string): string;
export declare function toIpfsUri(cid: string, path?: string): string;
export declare function toDagPbLink(node: EncodedCar, name: string): Promise<DagPbLink>;
export declare function toDirectoryBlock(links: DagPbLink[]): Promise<DagPbBlock>;
export declare function toEncodedCar(block: DagPbBlock, blockstore: Blockstore): Promise<EncodedCar>;
