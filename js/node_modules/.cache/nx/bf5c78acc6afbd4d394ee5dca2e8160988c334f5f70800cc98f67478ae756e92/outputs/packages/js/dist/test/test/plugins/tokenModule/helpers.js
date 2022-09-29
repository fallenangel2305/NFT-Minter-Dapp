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
exports.refreshToken = exports.assertRefreshedTokenHasAmount = exports.assertTokenHasAmount = void 0;
const index_1 = require("../../../src/index");
const assertTokenHasAmount = (t, token, amount) => {
    t.true((0, index_1.isEqualToAmount)(token.amount, amount), `token has amount: ${(0, index_1.formatAmount)(amount)}`);
};
exports.assertTokenHasAmount = assertTokenHasAmount;
const assertRefreshedTokenHasAmount = (t, metaplex, token, amount) => __awaiter(void 0, void 0, void 0, function* () {
    const refreshedToken = yield (0, exports.refreshToken)(metaplex, token);
    (0, exports.assertTokenHasAmount)(t, refreshedToken, amount);
});
exports.assertRefreshedTokenHasAmount = assertRefreshedTokenHasAmount;
const refreshToken = (metaplex, token) => {
    return metaplex.tokens().findTokenByAddress({ address: token.address }).run();
};
exports.refreshToken = refreshToken;
//# sourceMappingURL=helpers.js.map