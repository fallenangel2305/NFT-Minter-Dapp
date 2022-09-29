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
exports.Disposable = void 0;
const eventemitter3_1 = __importDefault(require("eventemitter3"));
class Disposable {
    constructor(signal) {
        this.cancelationError = null;
        this.signal = signal;
        this.eventEmitter = new eventemitter3_1.default.EventEmitter();
        this.abortListener = (error) => {
            this.cancelationError = error;
            this.eventEmitter.emit('cancel', error);
            this.close();
        };
        this.signal.addEventListener('abort', this.abortListener);
    }
    run(callback, thenCloseDisposable = true) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield Promise.resolve(callback(this.getScope()));
            }
            finally {
                if (thenCloseDisposable) {
                    this.close();
                }
            }
        });
    }
    getScope() {
        return {
            signal: this.signal,
            isCanceled: () => this.isCanceled(),
            getCancelationError: () => this.cancelationError,
            throwIfCanceled: () => {
                if (this.isCanceled()) {
                    throw this.getCancelationError();
                }
            },
        };
    }
    isCanceled() {
        return this.signal.aborted;
    }
    getCancelationError() {
        return this.cancelationError;
    }
    onCancel(callback) {
        this.eventEmitter.on('cancel', callback);
        return this;
    }
    close() {
        this.signal.removeEventListener('abort', this.abortListener);
        this.eventEmitter.removeAllListeners();
    }
}
exports.Disposable = Disposable;
//# sourceMappingURL=Disposable.js.map