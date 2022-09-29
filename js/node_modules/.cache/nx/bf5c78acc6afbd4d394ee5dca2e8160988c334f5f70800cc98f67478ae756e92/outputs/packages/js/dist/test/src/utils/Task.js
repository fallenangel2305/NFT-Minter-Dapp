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
exports.Task = void 0;
const abort_controller_1 = __importDefault(require("abort-controller"));
const eventemitter3_1 = __importDefault(require("eventemitter3"));
const errors_1 = require("../errors");
const Disposable_1 = require("./Disposable");
class Task {
    constructor(callback, children = [], context = {}) {
        this.status = 'pending';
        this.result = undefined;
        this.error = undefined;
        this.callback = callback;
        this.children = children;
        this.context = context;
        this.eventEmitter = new eventemitter3_1.default.EventEmitter();
    }
    run(options = {}, ...inputs) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            if (this.isRunning()) {
                throw new errors_1.TaskIsAlreadyRunningError();
            }
            if (this.isPending() || ((_a = options.force) !== null && _a !== void 0 ? _a : false)) {
                return this.forceRun(options, ...inputs);
            }
            if (this.isSuccessful()) {
                return this.getResult();
            }
            throw this.getError();
        });
    }
    forceRun(options = {}, ...inputs) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            const disposable = new Disposable_1.Disposable((_a = options.signal) !== null && _a !== void 0 ? _a : new abort_controller_1.default().signal);
            disposable.onCancel((cancelError) => {
                this.setStatus('canceled');
                this.error = cancelError;
            });
            return disposable.run((scope) => __awaiter(this, void 0, void 0, function* () {
                const { isCanceled, throwIfCanceled } = scope;
                try {
                    // Start loading.
                    this.setStatus('running');
                    this.result = undefined;
                    this.error = undefined;
                    this.result = yield Promise.resolve(this.callback(scope, ...inputs));
                    throwIfCanceled();
                    this.setStatus('successful');
                    // Return the loaded result.
                    return this.result;
                }
                catch (newError) {
                    // Capture the error and reset the result.
                    this.error = newError;
                    this.result = undefined;
                    this.setStatus(isCanceled() ? 'canceled' : 'failed');
                    // Re-throw the error.
                    throw this.error;
                }
            }));
        });
    }
    loadWith(preloadedResult) {
        this.setStatus('successful');
        this.result = preloadedResult;
        this.error = undefined;
        return this;
    }
    reset() {
        this.setStatus('pending');
        this.result = undefined;
        this.error = undefined;
        return this;
    }
    setChildren(children) {
        this.children = children;
        return this;
    }
    getChildren() {
        return this.children;
    }
    getDescendants() {
        return this.children.flatMap((child) => [child, ...child.getDescendants()]);
    }
    setContext(context) {
        this.context = context;
        return this;
    }
    getContext() {
        return this.context;
    }
    getStatus() {
        return this.status;
    }
    getResult() {
        return this.result;
    }
    getError() {
        return this.error;
    }
    isPending() {
        return this.status === 'pending';
    }
    isRunning() {
        return this.status === 'running';
    }
    isCompleted() {
        return this.status !== 'pending' && this.status !== 'running';
    }
    isSuccessful() {
        return this.status === 'successful';
    }
    isFailed() {
        return this.status === 'failed';
    }
    isCanceled() {
        return this.status === 'canceled';
    }
    onStatusChange(callback) {
        this.eventEmitter.on('statusChange', callback);
        return this;
    }
    onStatusChangeTo(status, callback) {
        return this.onStatusChange((newStatus) => status === newStatus ? callback() : undefined);
    }
    onSuccess(callback) {
        return this.onStatusChangeTo('successful', callback);
    }
    onFailure(callback) {
        return this.onStatusChangeTo('failed', callback);
    }
    onCancel(callback) {
        return this.onStatusChangeTo('canceled', callback);
    }
    setStatus(newStatus) {
        if (this.status === newStatus)
            return;
        this.status = newStatus;
        this.eventEmitter.emit('statusChange', newStatus);
    }
}
exports.Task = Task;
//# sourceMappingURL=Task.js.map