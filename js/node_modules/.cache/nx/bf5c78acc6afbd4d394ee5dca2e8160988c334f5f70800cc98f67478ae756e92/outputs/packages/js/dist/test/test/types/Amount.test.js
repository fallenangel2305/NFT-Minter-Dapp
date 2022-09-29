"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const tape_1 = __importDefault(require("tape"));
const index_1 = require("../../src/index");
(0, tape_1.default)('[Amount] it can create amounts from any currencies', (t) => {
    const usdAmount = (0, index_1.amount)(1500, { symbol: 'USD', decimals: 2 });
    const gbpAmount = (0, index_1.amount)(4200, { symbol: 'GBP', decimals: 2 });
    t.equal(usdAmount.basisPoints.toNumber(), 1500);
    t.equal(usdAmount.currency.symbol, 'USD');
    t.equal(gbpAmount.basisPoints.toNumber(), 4200);
    t.equal(gbpAmount.currency.symbol, 'GBP');
    t.end();
});
(0, tape_1.default)('[Amount] it can be formatted', (t) => {
    const usdAmount = (0, index_1.amount)(1536, { symbol: 'USD', decimals: 2 });
    const gbpAmount = (0, index_1.amount)(4210, { symbol: 'GBP', decimals: 2 });
    const solAmount = (0, index_1.amount)(2500000000, { symbol: 'SOL', decimals: 9 });
    const solAmountLeadingZeroDecimal = (0, index_1.amount)(2005000000, {
        symbol: 'SOL',
        decimals: 9,
    });
    t.equal((0, index_1.formatAmount)(usdAmount), 'USD 15.36');
    t.equal((0, index_1.formatAmount)(gbpAmount), 'GBP 42.10');
    t.equal((0, index_1.formatAmount)(solAmount), 'SOL 2.500000000');
    t.equal((0, index_1.formatAmount)(solAmountLeadingZeroDecimal), 'SOL 2.005000000');
    t.end();
});
(0, tape_1.default)('[Amount] it has helpers for certain currencies', (t) => {
    amountEquals(t, (0, index_1.usd)(15.36), 'USD 15.36');
    amountEquals(t, (0, index_1.usd)(15.36), 'USD 15.36');
    amountEquals(t, (0, index_1.amount)(1536, index_1.USD), 'USD 15.36');
    amountEquals(t, (0, index_1.sol)(2.5), 'SOL 2.500000000');
    amountEquals(t, (0, index_1.lamports)(2500000000), 'SOL 2.500000000');
    amountEquals(t, (0, index_1.amount)(2500000000, index_1.SOL), 'SOL 2.500000000');
    t.end();
});
(0, tape_1.default)('[Amount] it can create amounts representing SPL tokens', (t) => {
    t.equal((0, index_1.token)(1).currency.namespace, 'spl-token');
    amountEquals(t, (0, index_1.token)(1), 'Token 1');
    amountEquals(t, (0, index_1.token)(4.5, 2), 'Token 4.50');
    amountEquals(t, (0, index_1.token)(6.2587, 9, 'DGEN'), 'DGEN 6.258700000');
    t.end();
});
(0, tape_1.default)('[Amount] it can add and subtract amounts together', (t) => {
    const a = (0, index_1.sol)(1.5);
    const b = (0, index_1.lamports)(4200000000); // 4.2 SOL
    amountEquals(t, (0, index_1.addAmounts)(a, b), 'SOL 5.700000000');
    amountEquals(t, (0, index_1.addAmounts)(b, a), 'SOL 5.700000000');
    amountEquals(t, (0, index_1.addAmounts)(a, (0, index_1.sol)(1)), 'SOL 2.500000000');
    amountEquals(t, (0, index_1.subtractAmounts)(a, b), 'SOL -2.700000000');
    amountEquals(t, (0, index_1.subtractAmounts)(b, a), 'SOL 2.700000000');
    amountEquals(t, (0, index_1.subtractAmounts)(a, (0, index_1.sol)(1)), 'SOL 0.500000000');
    t.end();
});
(0, tape_1.default)('[Amount] it fail to operate on amounts of different currencies', (t) => {
    try {
        // @ts-ignore because we want to test the error.
        (0, index_1.addAmounts)((0, index_1.sol)(1), (0, index_1.usd)(1));
        t.fail();
    }
    catch (error) {
        t.true(error instanceof index_1.CurrencyMismatchError);
        const customError = error;
        t.equal(customError.left, index_1.SOL);
        t.equal(customError.right, index_1.USD);
        t.equal(customError.operation, 'add');
        t.end();
    }
});
(0, tape_1.default)('[Amount] it can multiply and divide amounts', (t) => {
    amountEquals(t, (0, index_1.multiplyAmount)((0, index_1.sol)(1.5), 3), 'SOL 4.500000000');
    amountEquals(t, (0, index_1.multiplyAmount)((0, index_1.sol)(1.5), 3.78), 'SOL 5.659262581');
    amountEquals(t, (0, index_1.multiplyAmount)((0, index_1.sol)(1.5), -1), 'SOL -1.500000000');
    amountEquals(t, (0, index_1.divideAmount)((0, index_1.sol)(1.5), 3), 'SOL 0.500000000');
    amountEquals(t, (0, index_1.divideAmount)((0, index_1.sol)(1.5), 9), 'SOL 0.166666666');
    amountEquals(t, (0, index_1.divideAmount)((0, index_1.sol)(1.5), -1), 'SOL -1.500000000');
    t.end();
});
(0, tape_1.default)('[Amount] it can compare amounts together', (t) => {
    const a = (0, index_1.sol)(1.5);
    const b = (0, index_1.lamports)(4200000000); // 4.2 SOL
    t.false((0, index_1.isEqualToAmount)(a, b));
    t.true((0, index_1.isEqualToAmount)(a, (0, index_1.sol)(1.5)));
    t.true((0, index_1.isLessThanAmount)(a, b));
    t.false((0, index_1.isLessThanAmount)(b, a));
    t.false((0, index_1.isLessThanAmount)(a, (0, index_1.sol)(1.5)));
    t.true((0, index_1.isLessThanOrEqualToAmount)(a, b));
    t.true((0, index_1.isLessThanOrEqualToAmount)(a, (0, index_1.sol)(1.5)));
    t.false((0, index_1.isGreaterThanAmount)(a, b));
    t.true((0, index_1.isGreaterThanAmount)(b, a));
    t.false((0, index_1.isGreaterThanAmount)(a, (0, index_1.sol)(1.5)));
    t.false((0, index_1.isGreaterThanOrEqualToAmount)(a, b));
    t.true((0, index_1.isGreaterThanOrEqualToAmount)(a, (0, index_1.sol)(1.5)));
    t.true((0, index_1.isPositiveAmount)(a));
    t.false((0, index_1.isNegativeAmount)(a));
    t.false((0, index_1.isZeroAmount)(a));
    t.true((0, index_1.isPositiveAmount)((0, index_1.sol)(0)));
    t.false((0, index_1.isNegativeAmount)((0, index_1.sol)(0)));
    t.true((0, index_1.isZeroAmount)((0, index_1.sol)(0)));
    t.false((0, index_1.isPositiveAmount)((0, index_1.sol)(-1)));
    t.true((0, index_1.isNegativeAmount)((0, index_1.sol)(-1)));
    t.false((0, index_1.isZeroAmount)((0, index_1.sol)(-1)));
    t.end();
});
(0, tape_1.default)('[Amount] it returns a new instance when running operations', (t) => {
    const a = (0, index_1.sol)(1.5);
    const b = (0, index_1.lamports)(4200000000); // 4.2 SOL
    t.notEqual(a, (0, index_1.addAmounts)(a, b));
    t.notEqual(b, (0, index_1.addAmounts)(a, b));
    t.notEqual(a, (0, index_1.subtractAmounts)(a, b));
    t.notEqual(b, (0, index_1.subtractAmounts)(a, b));
    t.notEqual(a, (0, index_1.multiplyAmount)(a, 3));
    t.notEqual(a, (0, index_1.divideAmount)(a, 3));
    t.end();
});
const amountEquals = (t, amount, expected) => {
    const actual = (0, index_1.formatAmount)(amount);
    t.equal(actual, expected, `${actual} === ${expected}`);
};
//# sourceMappingURL=Amount.test.js.map