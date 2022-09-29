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
exports.create32BitsHashString = exports.create32BitsHash = exports.createCandyMachine = void 0;
const tweetnacl_1 = __importDefault(require("tweetnacl"));
const buffer_1 = require("buffer");
const helpers_1 = require("../../helpers");
const index_1 = require("../../../src/index");
function createCandyMachine(mx, input = {}) {
    return __awaiter(this, void 0, void 0, function* () {
        let { candyMachine, response } = yield mx
            .candyMachines()
            .create(Object.assign({ price: (0, index_1.sol)(1), sellerFeeBasisPoints: 500, itemsAvailable: (0, index_1.toBigNumber)(100) }, input))
            .run();
        if (input.items) {
            yield mx
                .candyMachines()
                .insertItems({
                candyMachine,
                authority: mx.identity(),
                items: input.items,
            })
                .run();
            candyMachine = yield mx.candyMachines().refresh(candyMachine).run();
        }
        yield helpers_1.amman.addr.addLabel('candy-machine', candyMachine.address);
        yield helpers_1.amman.addr.addLabel('tx: create candy-machine', response.signature);
        return {
            response,
            candyMachine,
        };
    });
}
exports.createCandyMachine = createCandyMachine;
function create32BitsHash(input, slice) {
    const hash = create32BitsHashString(input, slice);
    return buffer_1.Buffer.from(hash, 'utf8').toJSON().data;
}
exports.create32BitsHash = create32BitsHash;
function create32BitsHashString(input, slice = 32) {
    const hash = tweetnacl_1.default.hash(buffer_1.Buffer.from(input)).slice(0, slice / 2);
    return buffer_1.Buffer.from(hash).toString('hex');
}
exports.create32BitsHashString = create32BitsHashString;
//# sourceMappingURL=helpers.js.map