import { NFTStorage } from 'nft.storage';
import { NFTStorageMetaplexor } from '@nftstorage/metaplex-auth';
import { MetaplexFile, StorageDriver, Amount, Metaplex, Signer } from '@metaplex-foundation/js';
export declare type NftStorageDriverOptions = {
    identity?: Signer;
    token?: string;
    endpoint?: URL;
    gatewayHost?: string;
    batchSize?: number;
    useGatewayUrls?: boolean;
};
export declare class NftStorageDriver implements StorageDriver {
    readonly metaplex: Metaplex;
    readonly identity?: Signer;
    readonly token?: string;
    readonly endpoint?: URL;
    readonly gatewayHost?: string;
    onStoredChunk?: (size: number) => void;
    batchSize: number;
    useGatewayUrls: boolean;
    constructor(metaplex: Metaplex, options?: NftStorageDriverOptions);
    onProgress(callback: (size: number) => void): this;
    getUploadPrice(_bytes: number): Promise<Amount>;
    upload(file: MetaplexFile): Promise<string>;
    uploadAll(files: MetaplexFile[]): Promise<string[]>;
    client(): Promise<NFTStorage | NFTStorageMetaplexor>;
}
