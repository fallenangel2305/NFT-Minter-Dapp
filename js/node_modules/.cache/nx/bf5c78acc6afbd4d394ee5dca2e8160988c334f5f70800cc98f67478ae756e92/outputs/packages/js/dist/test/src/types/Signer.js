"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSignerHistogram = exports.isIdentitySigner = exports.isKeypairSigner = exports.isSigner = void 0;
const isSigner = (input) => {
    return (typeof input === 'object' &&
        'publicKey' in input &&
        ('secretKey' in input || 'signTransaction' in input));
};
exports.isSigner = isSigner;
const isKeypairSigner = (input) => {
    return (0, exports.isSigner)(input) && 'secretKey' in input && input.secretKey != null;
};
exports.isKeypairSigner = isKeypairSigner;
const isIdentitySigner = (input) => {
    return (0, exports.isSigner)(input) && !(0, exports.isKeypairSigner)(input);
};
exports.isIdentitySigner = isIdentitySigner;
const getSignerHistogram = (signers) => signers.reduce((signers, signer) => {
    var _a;
    const duplicateIndex = signers.all.findIndex(({ publicKey }) => publicKey.equals(signer.publicKey));
    const duplicate = (_a = signers.all[duplicateIndex]) !== null && _a !== void 0 ? _a : null;
    const duplicateIsIdentity = duplicate
        ? (0, exports.isIdentitySigner)(duplicate)
        : false;
    const signerIsIdentity = (0, exports.isIdentitySigner)(signer);
    if (!duplicate) {
        signers.all.push(signer);
        signerIsIdentity
            ? signers.identities.push(signer)
            : signers.keypairs.push(signer);
    }
    else if (duplicateIsIdentity && !signerIsIdentity) {
        // Prefer keypair than identity signer as it requires less user interactions.
        const duplicateIdentitiesIndex = signers.identities.findIndex(({ publicKey }) => publicKey.equals(signer.publicKey));
        signers.all.splice(duplicateIndex, 1);
        signers.identities.splice(duplicateIdentitiesIndex, 1);
        signers.all.push(signer);
        signers.keypairs.push(signer);
    }
    return signers;
}, { all: [], keypairs: [], identities: [] });
exports.getSignerHistogram = getSignerHistogram;
//# sourceMappingURL=Signer.js.map