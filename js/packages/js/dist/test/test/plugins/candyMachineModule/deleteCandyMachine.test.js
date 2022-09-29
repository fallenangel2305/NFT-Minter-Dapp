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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const tape_1 = __importDefault(require("tape"));
const helpers_1 = require("../../helpers");
const plugins_1 = require("../../../src/plugins");
const helpers_2 = require("./helpers");
(0, helpers_1.killStuckProcess)();
(0, tape_1.default)('[candyMachineModule] it can delete a candy machine', (t) => __awaiter(void 0, void 0, void 0, function* () {
    // Given an existing Candy Machine.
    const mx = yield (0, helpers_1.metaplex)();
    const { candyMachine } = yield (0, helpers_2.createCandyMachine)(mx);
    // When we delete that candy machine using default values.
    yield mx.candyMachines().delete({ candyMachine }).run();
    // Then the Candy Machine has been deleted.
    const account = yield mx.rpc().getAccount(candyMachine.address);
    t.false(account.exists, 'candy machine should not exist');
}));
(0, tape_1.default)('[candyMachineModule] it can delete a candy machine using an explicit authority', (t) => __awaiter(void 0, void 0, void 0, function* () {
    // Given an existing Candy Machine with an explicit authority.
    const mx = yield (0, helpers_1.metaplex)();
    const authority = yield (0, helpers_1.createWallet)(mx);
    const { candyMachine } = yield (0, helpers_2.createCandyMachine)(mx, { authority });
    // When we delete that candy machine using that authority.
    yield mx.candyMachines().delete({ candyMachine, authority }).run();
    // Then the Candy Machine has been deleted.
    const account = yield mx.rpc().getAccount(candyMachine.address);
    t.false(account.exists, 'candy machine should not exist');
}));
(0, tape_1.default)('[candyMachineModule] it cannot delete a candy machine using an invalid authority', (t) => __awaiter(void 0, void 0, void 0, function* () {
    // Given an existing Candy Machine.
    const mx = yield (0, helpers_1.metaplex)();
    const { candyMachine } = yield (0, helpers_2.createCandyMachine)(mx);
    // When we delete that candy machine using an invalid authority.
    const invalidAuthority = yield (0, helpers_1.createWallet)(mx);
    const promise = mx
        .candyMachines()
        .delete({ candyMachine, authority: invalidAuthority })
        .run();
    // Then we expect an error.
    yield (0, helpers_1.assertThrows)(t, promise, /A has one constraint was violated/);
}));
(0, tape_1.default)('[candyMachineModule] it can delete a candy machine with a collection NFT', (t) => __awaiter(void 0, void 0, void 0, function* () {
    // Given an existing Candy Machine with a collection NFT.
    const mx = yield (0, helpers_1.metaplex)();
    const collectionNft = yield (0, helpers_1.createNft)(mx);
    const { candyMachine } = yield (0, helpers_2.createCandyMachine)(mx, {
        collection: collectionNft.address,
    });
    // When we delete that candy machine.
    yield mx.candyMachines().delete({ candyMachine }).run();
    // Then the Candy Machine has been deleted.
    const account = yield mx.rpc().getAccount(candyMachine.address);
    t.false(account.exists, 'candy machine should not exist');
    // And the Collection PDA has also been deleted.
    const collectionPda = yield mx
        .rpc()
        .getAccount((0, plugins_1.findCandyMachineCollectionPda)(candyMachine.address));
    t.false(collectionPda.exists, 'candy machine collection PDA should not exist');
}));
//# sourceMappingURL=deleteCandyMachine.test.js.map