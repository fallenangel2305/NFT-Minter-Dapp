"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.findProgramAsBurnerPda = exports.findUseAuthorityRecordPda = exports.findCollectionAuthorityRecordPda = exports.findEditionMarkerPda = exports.findEditionPda = exports.findMasterEditionV2Pda = exports.findMetadataPda = void 0;
const buffer_1 = require("buffer");
const types_1 = require("../../types");
const program_1 = require("./program");
/** @group Pdas */
const findMetadataPda = (mint, programId = program_1.TokenMetadataProgram.publicKey) => {
    return types_1.Pda.find(programId, [
        buffer_1.Buffer.from('metadata', 'utf8'),
        programId.toBuffer(),
        mint.toBuffer(),
    ]);
};
exports.findMetadataPda = findMetadataPda;
/** @group Pdas */
const findMasterEditionV2Pda = (mint, programId = program_1.TokenMetadataProgram.publicKey) => {
    return types_1.Pda.find(programId, [
        buffer_1.Buffer.from('metadata', 'utf8'),
        programId.toBuffer(),
        mint.toBuffer(),
        buffer_1.Buffer.from('edition', 'utf8'),
    ]);
};
exports.findMasterEditionV2Pda = findMasterEditionV2Pda;
/** @group Pdas */
const findEditionPda = (mint, programId = program_1.TokenMetadataProgram.publicKey) => {
    return types_1.Pda.find(programId, [
        buffer_1.Buffer.from('metadata', 'utf8'),
        programId.toBuffer(),
        mint.toBuffer(),
        buffer_1.Buffer.from('edition', 'utf8'),
    ]);
};
exports.findEditionPda = findEditionPda;
/** @group Pdas */
const findEditionMarkerPda = (mint, edition, programId = program_1.TokenMetadataProgram.publicKey) => {
    return types_1.Pda.find(programId, [
        buffer_1.Buffer.from('metadata', 'utf8'),
        programId.toBuffer(),
        mint.toBuffer(),
        buffer_1.Buffer.from('edition', 'utf8'),
        buffer_1.Buffer.from(edition.div((0, types_1.toBigNumber)(248)).toString()),
    ]);
};
exports.findEditionMarkerPda = findEditionMarkerPda;
/** @group Pdas */
const findCollectionAuthorityRecordPda = (mint, collectionAuthority, programId = program_1.TokenMetadataProgram.publicKey) => {
    return types_1.Pda.find(programId, [
        buffer_1.Buffer.from('metadata', 'utf8'),
        programId.toBuffer(),
        mint.toBuffer(),
        buffer_1.Buffer.from('collection_authority', 'utf8'),
        collectionAuthority.toBuffer(),
    ]);
};
exports.findCollectionAuthorityRecordPda = findCollectionAuthorityRecordPda;
/** @group Pdas */
const findUseAuthorityRecordPda = (mint, useAuthority, programId = program_1.TokenMetadataProgram.publicKey) => {
    return types_1.Pda.find(programId, [
        buffer_1.Buffer.from('metadata', 'utf8'),
        programId.toBuffer(),
        mint.toBuffer(),
        buffer_1.Buffer.from('user', 'utf8'),
        useAuthority.toBuffer(),
    ]);
};
exports.findUseAuthorityRecordPda = findUseAuthorityRecordPda;
/** @group Pdas */
const findProgramAsBurnerPda = (programId = program_1.TokenMetadataProgram.publicKey) => {
    return types_1.Pda.find(programId, [
        buffer_1.Buffer.from('metadata', 'utf8'),
        programId.toBuffer(),
        buffer_1.Buffer.from('burn', 'utf8'),
    ]);
};
exports.findProgramAsBurnerPda = findProgramAsBurnerPda;
//# sourceMappingURL=pdas.js.map