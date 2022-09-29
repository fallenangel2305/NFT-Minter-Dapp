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
const abort_controller_1 = require("abort-controller");
const index_1 = require("../../src/index");
(0, tape_1.default)('[Disposable] it can cancel callbacks', (t) => __awaiter(void 0, void 0, void 0, function* () {
    // Given a disposable.
    const abortController = new abort_controller_1.AbortController();
    const disposable = new index_1.Disposable(abortController.signal);
    // And a variable that keeps track of some callback execution.
    let endOfCallbackExecuted = false;
    // When we run a callback that throws early if it is cancelled.
    const promise = disposable.run(({ throwIfCanceled }) => __awaiter(void 0, void 0, void 0, function* () {
        yield new Promise((resolve) => setTimeout(resolve, 100));
        throwIfCanceled();
        endOfCallbackExecuted = true;
    }));
    // And we abort the disposable.
    abortController.abort();
    // Then the disposable callback threw an error.
    try {
        yield promise;
        t.fail('disposable callback should have thrown an error');
    }
    catch (error) {
        // And the last part of the callback was not executed.
        t.false(endOfCallbackExecuted, 'end of callback not executed');
        // And the disposable kepts track of the cancellation error.
        t.ok(disposable.isCanceled(), 'disposable is cancelled');
        t.equal(error, disposable.getCancelationError());
    }
}));
(0, tape_1.default)('[Disposable] it provides a useful scope to the callback', (t) => __awaiter(void 0, void 0, void 0, function* () {
    // Given a disposable.
    const abortController = new abort_controller_1.AbortController();
    const disposable = new index_1.Disposable(abortController.signal);
    // When we use it to run a callback.
    yield disposable.run((scope) => __awaiter(void 0, void 0, void 0, function* () {
        // Then we get a useful scope.
        t.equals(typeof scope.throwIfCanceled, 'function');
        t.equal(scope.signal, abortController.signal);
        t.false(scope.isCanceled(), 'isCanceled returns false');
        t.equals(scope.getCancelationError(), null);
        // And that scope returns different values based on the disposable state.
        abortController.abort();
        t.true(scope.isCanceled(), 'isCanceled returns true');
    }));
}));
(0, tape_1.default)('[Disposable] it can listen to the disposable cancellation', (t) => __awaiter(void 0, void 0, void 0, function* () {
    // Given a disposable.
    const abortController = new abort_controller_1.AbortController();
    const disposable = new index_1.Disposable(abortController.signal);
    // With an abort listener registered.
    let abortListenerExecuted = false;
    disposable.onCancel(() => {
        abortListenerExecuted = true;
    });
    // When we abort the disposable.
    abortController.abort();
    // Then the abort listener was executed.
    t.true(abortListenerExecuted, 'abort listener was executed');
}));
(0, tape_1.default)('[Disposable] it can close the abort listener', (t) => __awaiter(void 0, void 0, void 0, function* () {
    // Given a disposable.
    const abortController = new abort_controller_1.AbortController();
    const disposable = new index_1.Disposable(abortController.signal);
    // With an abort listener registered.
    let abortListenerExecuted = false;
    disposable.onCancel(() => {
        abortListenerExecuted = true;
    });
    // When we close the disposable before aborting it.
    disposable.close();
    abortController.abort();
    // Then the abort listener was not executed.
    t.false(abortListenerExecuted, 'abort listener was not executed');
}));
(0, tape_1.default)('[Disposable] it closes the abort listener after running a callback by default', (t) => __awaiter(void 0, void 0, void 0, function* () {
    // Given a disposable.
    const abortController = new abort_controller_1.AbortController();
    const disposable = new index_1.Disposable(abortController.signal);
    // With an abort listener registered.
    let abortListenerExecuted = false;
    disposable.onCancel(() => {
        abortListenerExecuted = true;
    });
    // When we finish executing any callback.
    yield disposable.run(() => { });
    // And then abort the disposable.
    abortController.abort();
    // Then, by default, the abort listener was not executed.
    t.false(abortListenerExecuted, 'abort listener was not executed');
}));
//# sourceMappingURL=Disposable.test.js.map