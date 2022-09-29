"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.toEncodedCar = exports.toDirectoryBlock = exports.toDagPbLink = exports.toIpfsUri = exports.toGatewayUri = exports.DEFAULT_GATEWAY_HOST = void 0;
const Block = __importStar(require("multiformats/block"));
const sha2_1 = require("multiformats/hashes/sha2");
const dagPb = __importStar(require("@ipld/dag-pb"));
const ipfs_unixfs_1 = require("ipfs-unixfs");
const BlockstoreCarReader_1 = require("./BlockstoreCarReader");
exports.DEFAULT_GATEWAY_HOST = 'https://nftstorage.link';
function toGatewayUri(cid, path = '', host = exports.DEFAULT_GATEWAY_HOST) {
    let pathPrefix = `/ipfs/${cid}`;
    if (path) {
        pathPrefix += '/';
    }
    host = host || exports.DEFAULT_GATEWAY_HOST;
    const base = new URL(pathPrefix, host);
    const u = new URL(path, base);
    return u.toString();
}
exports.toGatewayUri = toGatewayUri;
function toIpfsUri(cid, path = '') {
    const u = new URL(path, `ipfs://${cid}`);
    return u.toString();
}
exports.toIpfsUri = toIpfsUri;
function toDagPbLink(node, name) {
    return __awaiter(this, void 0, void 0, function* () {
        const block = yield node.car.get(node.cid);
        if (!block) {
            throw new Error(`invalid CAR: missing block for CID [${node.cid}]`);
        }
        return dagPb.createLink(name, block.bytes.byteLength, node.cid);
    });
}
exports.toDagPbLink = toDagPbLink;
function toDirectoryBlock(links) {
    return __awaiter(this, void 0, void 0, function* () {
        const data = new ipfs_unixfs_1.UnixFS({ type: 'directory' }).marshal();
        const value = dagPb.createNode(data, links);
        return Block.encode({ value, codec: dagPb, hasher: sha2_1.sha256 });
    });
}
exports.toDirectoryBlock = toDirectoryBlock;
function toEncodedCar(block, blockstore) {
    return __awaiter(this, void 0, void 0, function* () {
        yield blockstore.put(block.cid, block.bytes);
        const car = new BlockstoreCarReader_1.BlockstoreCarReader([block.cid], blockstore);
        const cid = block.cid;
        return { car, cid };
    });
}
exports.toEncodedCar = toEncodedCar;
//# sourceMappingURL=utils.js.map