"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MetadataV1GpaBuilder = exports.TokenMetadataGpaBuilder = void 0;
const mpl_token_metadata_1 = require("@metaplex-foundation/mpl-token-metadata");
const buffer_1 = require("buffer");
const utils_1 = require("../../utils");
const types_1 = require("../../types");
const MAX_NAME_LENGTH = 32;
const MAX_SYMBOL_LENGTH = 10;
const MAX_URI_LENGTH = 200;
const MAX_CREATOR_LEN = 32 + 1 + 1;
const DATA_START = 1 + 32 + 32;
const NAME_START = DATA_START + 4;
const SYMBOL_START = NAME_START + MAX_NAME_LENGTH + 4;
const URI_START = SYMBOL_START + MAX_SYMBOL_LENGTH + 4;
const CREATORS_START = URI_START + MAX_URI_LENGTH + 2 + 1 + 4;
class TokenMetadataGpaBuilder extends utils_1.GpaBuilder {
    constructor(metaplex, programId) {
        super(metaplex, programId !== null && programId !== void 0 ? programId : mpl_token_metadata_1.PROGRAM_ID);
    }
    whereKey(key) {
        return this.where(0, (0, types_1.toBigNumber)(key, 'le'));
    }
}
exports.TokenMetadataGpaBuilder = TokenMetadataGpaBuilder;
class MetadataV1GpaBuilder extends TokenMetadataGpaBuilder {
    constructor(metaplex, programId) {
        super(metaplex, programId);
        this.whereKey(mpl_token_metadata_1.Key.MetadataV1);
    }
    selectUpdatedAuthority() {
        return this.slice(1, 32);
    }
    whereUpdateAuthority(updateAuthority) {
        return this.where(1, updateAuthority);
    }
    selectMint() {
        return this.slice(33, 32);
    }
    whereMint(mint) {
        return this.where(33, mint);
    }
    selectName() {
        return this.slice(NAME_START, MAX_NAME_LENGTH);
    }
    whereName(name) {
        return this.where(NAME_START, buffer_1.Buffer.from((0, utils_1.padEmptyChars)(name, MAX_NAME_LENGTH)));
    }
    selectSymbol() {
        return this.slice(SYMBOL_START, MAX_SYMBOL_LENGTH);
    }
    whereSymbol(symbol) {
        return this.where(SYMBOL_START, buffer_1.Buffer.from((0, utils_1.padEmptyChars)(symbol, MAX_SYMBOL_LENGTH)));
    }
    selectUri() {
        return this.slice(URI_START, MAX_URI_LENGTH);
    }
    whereUri(uri) {
        return this.where(URI_START, buffer_1.Buffer.from((0, utils_1.padEmptyChars)(uri, MAX_URI_LENGTH)));
    }
    selectCreator(position) {
        return this.slice(CREATORS_START + (position - 1) * MAX_CREATOR_LEN, CREATORS_START + position * MAX_CREATOR_LEN);
    }
    whereCreator(position, creator) {
        return this.where(CREATORS_START + (position - 1) * MAX_CREATOR_LEN, creator);
    }
    selectFirstCreator() {
        return this.selectCreator(1);
    }
    whereFirstCreator(firstCreator) {
        return this.whereCreator(1, firstCreator);
    }
}
exports.MetadataV1GpaBuilder = MetadataV1GpaBuilder;
//# sourceMappingURL=gpaBuilders.js.map