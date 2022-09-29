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
const constants_1 = require("../../../src/plugins/candyMachineModule/constants");
const tape_1 = __importDefault(require("tape"));
const helpers_1 = require("../../helpers");
const helpers_2 = require("./helpers");
const index_1 = require("../../../src/index");
(0, helpers_1.killStuckProcess)();
(0, tape_1.default)('[candyMachineModule] it can add items to a candy machine', (t) => __awaiter(void 0, void 0, void 0, function* () {
    // Given an existing Candy Machine with a capacity of 100 items.
    const mx = yield (0, helpers_1.metaplex)();
    const { candyMachine } = yield (0, helpers_2.createCandyMachine)(mx, {
        itemsAvailable: (0, index_1.toBigNumber)(100),
    });
    // When we add two items to the Candy Machine.
    yield mx
        .candyMachines()
        .insertItems({
        candyMachine,
        authority: mx.identity(),
        items: [
            { name: 'Degen #1', uri: 'https://example.com/degen/1' },
            { name: 'Degen #2', uri: 'https://example.com/degen/2' },
        ],
    })
        .run();
    const updatedCandyMachine = yield mx
        .candyMachines()
        .refresh(candyMachine)
        .run();
    // Then the Candy Machine has been updated properly.
    t.false(updatedCandyMachine.isFullyLoaded);
    t.equals(updatedCandyMachine.itemsLoaded.toNumber(), 2);
    t.equals(updatedCandyMachine.items.length, 2);
    t.deepEquals(updatedCandyMachine.items, [
        { name: 'Degen #1', uri: 'https://example.com/degen/1' },
        { name: 'Degen #2', uri: 'https://example.com/degen/2' },
    ]);
}));
(0, tape_1.default)('[candyMachineModule] it cannot add items that would make the candy machine exceed the maximum capacity', (t) => __awaiter(void 0, void 0, void 0, function* () {
    // Given an existing Candy Machine with a capacity of 2 items.
    const mx = yield (0, helpers_1.metaplex)();
    const { candyMachine } = yield (0, helpers_2.createCandyMachine)(mx, {
        itemsAvailable: (0, index_1.toBigNumber)(2),
    });
    // When we try to add 3 items to the Candy Machine.
    const promise = mx
        .candyMachines()
        .insertItems({
        candyMachine,
        authority: mx.identity(),
        items: [
            { name: 'Degen #1', uri: 'https://example.com/degen/1' },
            { name: 'Degen #2', uri: 'https://example.com/degen/2' },
            { name: 'Degen #3', uri: 'https://example.com/degen/3' },
        ],
    })
        .run();
    // Then we expect an error to be thrown.
    yield (0, helpers_1.assertThrows)(t, promise, /Candy Machine Cannot Add Amount/);
}));
(0, tape_1.default)('[candyMachineModule] it cannot add items once the candy machine is fully loaded', (t) => __awaiter(void 0, void 0, void 0, function* () {
    // Given an existing Candy Machine with 2 items loaded and a capacity of 2 items.
    const mx = yield (0, helpers_1.metaplex)();
    const { candyMachine } = yield (0, helpers_2.createCandyMachine)(mx, {
        itemsAvailable: (0, index_1.toBigNumber)(2),
        items: [
            { name: 'Degen #1', uri: 'https://example.com/degen/1' },
            { name: 'Degen #2', uri: 'https://example.com/degen/2' },
        ],
    });
    // When we try to add one more item to the Candy Machine.
    const promise = mx
        .candyMachines()
        .insertItems({
        candyMachine,
        authority: mx.identity(),
        items: [{ name: 'Degen #3', uri: 'https://example.com/degen/3' }],
    })
        .run();
    // Then we expect an error to be thrown.
    yield (0, helpers_1.assertThrows)(t, promise, /Candy Machine Is Full/);
}));
(0, tape_1.default)('[candyMachineModule] it cannot add items if either of them have a name or URI that is too long', (t) => __awaiter(void 0, void 0, void 0, function* () {
    // Given an existing Candy Machine.
    const mx = yield (0, helpers_1.metaplex)();
    const { candyMachine } = yield (0, helpers_2.createCandyMachine)(mx);
    // When we try to add items that are too long.
    const promise = mx
        .candyMachines()
        .insertItems({
        candyMachine,
        authority: mx.identity(),
        items: [
            { name: 'Degen #1', uri: 'https://example.com/degen/1' },
            {
                name: 'x'.repeat(constants_1.MAX_NAME_LENGTH + 1),
                uri: 'https://example.com/degen/2',
            },
            { name: 'Degen #3', uri: 'x'.repeat(constants_1.MAX_URI_LENGTH + 1) },
        ],
    })
        .run();
    // Then we expect an error to be thrown.
    yield (0, helpers_1.assertThrows)(t, promise, /Candy Machine Add Item Constraints Violated/);
}));
(0, tape_1.default)('[candyMachineModule] it can add items to a custom offset and override existing items', (t) => __awaiter(void 0, void 0, void 0, function* () {
    // Given an existing Candy Machine with 2 items loaded and capacity of 3 items.
    const mx = yield (0, helpers_1.metaplex)();
    const { candyMachine } = yield (0, helpers_2.createCandyMachine)(mx, {
        itemsAvailable: (0, index_1.toBigNumber)(3),
        items: [
            { name: 'Degen #1', uri: 'https://example.com/degen/1' },
            { name: 'Degen #2', uri: 'https://example.com/degen/2' },
        ],
    });
    // When we add 2 items to the Candy Machine at index 1.
    yield mx
        .candyMachines()
        .insertItems({
        candyMachine,
        authority: mx.identity(),
        index: (0, index_1.toBigNumber)(1),
        items: [
            { name: 'Degen #3', uri: 'https://example.com/degen/3' },
            { name: 'Degen #4', uri: 'https://example.com/degen/4' },
        ],
    })
        .run();
    const updatedCandyMachine = yield mx
        .candyMachines()
        .refresh(candyMachine)
        .run();
    // Then the Candy Machine has been updated properly.
    t.true(updatedCandyMachine.isFullyLoaded);
    t.equals(updatedCandyMachine.itemsLoaded.toNumber(), 3);
    t.equals(updatedCandyMachine.items.length, 3);
    // And the item of index 1 was overriden.
    t.deepEquals(updatedCandyMachine.items, [
        { name: 'Degen #1', uri: 'https://example.com/degen/1' },
        { name: 'Degen #3', uri: 'https://example.com/degen/3' },
        { name: 'Degen #4', uri: 'https://example.com/degen/4' },
    ]);
}));
//# sourceMappingURL=insertItemsToCandyMachine.test.js.map