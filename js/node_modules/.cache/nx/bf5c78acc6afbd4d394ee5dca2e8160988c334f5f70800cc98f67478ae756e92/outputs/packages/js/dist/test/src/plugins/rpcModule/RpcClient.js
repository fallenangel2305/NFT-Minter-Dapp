"use strict";
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
exports.RpcClient = void 0;
const web3_js_1 = require("@solana/web3.js");
const types_1 = require("../../types");
const utils_1 = require("../../utils");
const errors_1 = require("../../errors");
/**
 * @group Modules
 */
class RpcClient {
    constructor(metaplex) {
        this.metaplex = metaplex;
    }
    sendTransaction(transaction, signers = [], sendOptions = {}) {
        var _a, _b;
        return __awaiter(this, void 0, void 0, function* () {
            if (transaction instanceof utils_1.TransactionBuilder) {
                signers = [...transaction.getSigners(), ...signers];
                transaction = transaction.toTransaction();
            }
            (_a = transaction.feePayer) !== null && _a !== void 0 ? _a : (transaction.feePayer = this.getDefaultFeePayer());
            (_b = transaction.recentBlockhash) !== null && _b !== void 0 ? _b : (transaction.recentBlockhash = yield this.getLatestBlockhash());
            if (transaction.feePayer &&
                this.metaplex.identity().equals(transaction.feePayer)) {
                signers = [this.metaplex.identity(), ...signers];
            }
            const { keypairs, identities } = (0, types_1.getSignerHistogram)(signers);
            if (keypairs.length > 0) {
                transaction.partialSign(...keypairs);
            }
            for (let i = 0; i < identities.length; i++) {
                yield identities[i].signTransaction(transaction);
            }
            const rawTransaction = transaction.serialize();
            try {
                return yield this.metaplex.connection.sendRawTransaction(rawTransaction, sendOptions);
            }
            catch (error) {
                throw this.parseProgramError(error, transaction);
            }
        });
    }
    confirmTransaction(signature, commitment) {
        return __awaiter(this, void 0, void 0, function* () {
            let rpcResponse;
            try {
                rpcResponse = yield this.metaplex.connection.confirmTransaction(signature, commitment);
            }
            catch (error) {
                throw new errors_1.FailedToConfirmTransactionError(error);
            }
            if (rpcResponse.value.err) {
                throw new errors_1.FailedToConfirmTransactionWithResponseError(rpcResponse);
            }
            return rpcResponse;
        });
    }
    sendAndConfirmTransaction(transaction, signers, confirmOptions) {
        return __awaiter(this, void 0, void 0, function* () {
            const signature = yield this.sendTransaction(transaction, signers, confirmOptions);
            const confirmResponse = yield this.confirmTransaction(signature, confirmOptions === null || confirmOptions === void 0 ? void 0 : confirmOptions.commitment);
            return { signature, confirmResponse };
        });
    }
    getAccount(publicKey, commitment) {
        return __awaiter(this, void 0, void 0, function* () {
            const accountInfo = yield this.metaplex.connection.getAccountInfo(publicKey, commitment);
            return this.getUnparsedMaybeAccount(publicKey, accountInfo);
        });
    }
    accountExists(publicKey, commitment) {
        return __awaiter(this, void 0, void 0, function* () {
            const balance = yield this.metaplex.connection.getBalance(publicKey, commitment);
            return balance > 0;
        });
    }
    getMultipleAccounts(publicKeys, commitment) {
        return __awaiter(this, void 0, void 0, function* () {
            const accountInfos = yield this.metaplex.connection.getMultipleAccountsInfo(publicKeys, commitment);
            return (0, utils_1.zipMap)(publicKeys, accountInfos, (publicKey, accountInfo) => {
                return this.getUnparsedMaybeAccount(publicKey, accountInfo);
            });
        });
    }
    getProgramAccounts(programId, configOrCommitment) {
        return __awaiter(this, void 0, void 0, function* () {
            const accounts = yield this.metaplex.connection.getProgramAccounts(programId, configOrCommitment);
            return accounts.map(({ pubkey, account }) => (Object.assign({ publicKey: pubkey }, account)));
        });
    }
    airdrop(publicKey, amount, commitment) {
        return __awaiter(this, void 0, void 0, function* () {
            (0, types_1.assertSol)(amount);
            const signature = yield this.metaplex.connection.requestAirdrop(publicKey, amount.basisPoints.toNumber());
            const confirmResponse = yield this.confirmTransaction(signature, commitment);
            return { signature, confirmResponse };
        });
    }
    getBalance(publicKey, commitment) {
        return __awaiter(this, void 0, void 0, function* () {
            const balance = yield this.metaplex.connection.getBalance(publicKey, commitment);
            return (0, types_1.lamports)(balance);
        });
    }
    getRent(bytes, commitment) {
        return __awaiter(this, void 0, void 0, function* () {
            const rent = yield this.metaplex.connection.getMinimumBalanceForRentExemption(bytes, commitment);
            return (0, types_1.lamports)(rent);
        });
    }
    getLatestBlockhash() {
        return __awaiter(this, void 0, void 0, function* () {
            return (yield this.metaplex.connection.getLatestBlockhash('finalized'))
                .blockhash;
        });
    }
    getSolanaExporerUrl(signature) {
        let clusterParam = '';
        switch (this.metaplex.cluster) {
            case 'devnet':
                clusterParam = '?cluster=devnet';
                break;
            case 'testnet':
                clusterParam = '?cluster=testnet';
                break;
            case 'localnet':
            case 'custom':
                const url = encodeURIComponent(this.metaplex.connection.rpcEndpoint);
                clusterParam = `?cluster=custom&customUrl=${url}`;
                break;
        }
        return `https://explorer.solana.com/tx/${signature}${clusterParam}`;
    }
    getDefaultFeePayer() {
        const identity = this.metaplex.identity().publicKey;
        return identity.equals(web3_js_1.PublicKey.default) ? undefined : identity;
    }
    getUnparsedMaybeAccount(publicKey, accountInfo) {
        if (!accountInfo) {
            return { publicKey, exists: false };
        }
        return Object.assign({ publicKey, exists: true }, accountInfo);
    }
    parseProgramError(error, transaction) {
        var _a, _b, _c, _d, _e;
        // Ensure the error as logs.
        if (!(0, types_1.isErrorWithLogs)(error)) {
            return new errors_1.FailedToSendTransactionError(error);
        }
        // Parse the instruction number.
        const regex = /Error processing Instruction (\d+):/;
        const instruction = (_b = (_a = error.message.match(regex)) === null || _a === void 0 ? void 0 : _a[1]) !== null && _b !== void 0 ? _b : null;
        // Ensure there is an instruction number given to find the program.
        if (!instruction) {
            return new errors_1.FailedToSendTransactionError(error);
        }
        // Get the program ID from the instruction in the transaction.
        const instructionNumber = parseInt(instruction, 10);
        const programId = (_e = (_d = (_c = transaction.instructions) === null || _c === void 0 ? void 0 : _c[instructionNumber]) === null || _d === void 0 ? void 0 : _d.programId) !== null && _e !== void 0 ? _e : null;
        // Ensure we were able to find a program ID for the instruction.
        if (!programId) {
            return new errors_1.FailedToSendTransactionError(error);
        }
        // Find a registered program if any.
        let program;
        try {
            program = this.metaplex.programs().get(programId);
        }
        catch (_programNotFoundError) {
            return new errors_1.FailedToSendTransactionError(error);
        }
        // Ensure an error resolver exists on the program.
        if (!program.errorResolver) {
            return new errors_1.UnknownProgramError(program, error);
        }
        // Finally, resolve the error.
        const resolvedError = program.errorResolver(error);
        return resolvedError
            ? new errors_1.ParsedProgramError(program, resolvedError)
            : new errors_1.UnknownProgramError(program, error);
    }
}
exports.RpcClient = RpcClient;
//# sourceMappingURL=RpcClient.js.map