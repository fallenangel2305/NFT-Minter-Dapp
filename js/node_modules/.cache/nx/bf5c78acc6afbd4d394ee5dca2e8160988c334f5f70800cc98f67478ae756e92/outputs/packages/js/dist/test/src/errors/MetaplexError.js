"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MetaplexError = void 0;
/** @group Errors */
class MetaplexError extends Error {
    constructor(input) {
        var _a, _b, _c, _d, _e, _f, _g, _h;
        super(input.problem);
        this.name = 'MetaplexError';
        this.key = `metaplex.errors.${input.key}`;
        this.title = input.title;
        this.problem = overrideWithOptions(input.problem, (_a = input.options) === null || _a === void 0 ? void 0 : _a.problem, (_b = input.options) === null || _b === void 0 ? void 0 : _b.problemPrefix, (_c = input.options) === null || _c === void 0 ? void 0 : _c.problemSuffix);
        this.solution = overrideWithOptions(input.solution, (_d = input.options) === null || _d === void 0 ? void 0 : _d.solution, (_e = input.options) === null || _e === void 0 ? void 0 : _e.solutionPrefix, (_f = input.options) === null || _f === void 0 ? void 0 : _f.solutionSuffix);
        this.source = input.source;
        this.sourceDetails = input.sourceDetails;
        this.cause = (_g = input.options) === null || _g === void 0 ? void 0 : _g.cause;
        this.logs = (_h = input.options) === null || _h === void 0 ? void 0 : _h.logs;
        this.message = this.toString(false);
    }
    getCapitalizedSource() {
        if (this.source === 'sdk' || this.source === 'rpc') {
            return this.source.toUpperCase();
        }
        return this.source[0].toUpperCase() + this.source.slice(1);
    }
    getFullSource() {
        const capitalizedSource = this.getCapitalizedSource();
        const sourceDetails = this.sourceDetails ? ` > ${this.sourceDetails}` : '';
        return capitalizedSource + sourceDetails;
    }
    toString(withName = true) {
        const logs = this.logs != null ? `\n\n[ Logs: ${this.logs.join(' |$> ')} ]` : '';
        const causedBy = this.cause ? `\n\nCaused By: ${this.cause}` : '';
        return ((withName ? `[${this.name}] ` : '') +
            `${this.title}` +
            `\n>> Source: ${this.getFullSource()}` +
            `\n>> Problem: ${this.problem}` +
            `\n>> Solution: ${this.solution}` +
            causedBy +
            logs +
            '\n');
    }
}
exports.MetaplexError = MetaplexError;
const overrideWithOptions = (defaultText, override, prefix, suffix) => {
    return [prefix, override !== null && override !== void 0 ? override : defaultText, suffix]
        .filter((text) => !!text)
        .join(' ');
};
//# sourceMappingURL=MetaplexError.js.map