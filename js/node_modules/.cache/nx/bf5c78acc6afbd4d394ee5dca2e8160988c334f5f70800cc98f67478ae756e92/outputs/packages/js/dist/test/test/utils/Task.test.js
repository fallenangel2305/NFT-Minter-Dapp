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
const abort_controller_1 = __importDefault(require("abort-controller"));
const index_1 = require("../../src/index");
(0, tape_1.default)('[Task] it can succeed with an asynchronous callback', (t) => __awaiter(void 0, void 0, void 0, function* () {
    // Given a "pending" async task that returns a number.
    const task = new index_1.Task(() => __awaiter(void 0, void 0, void 0, function* () {
        t.equal(task.getStatus(), 'running');
        return 42;
    }));
    t.equal(task.getResult(), undefined);
    t.equal(task.getStatus(), 'pending');
    // When we run the task.
    yield task.run();
    // Then we get the right result and it was marked as successful.
    t.equal(task.getResult(), 42);
    t.equal(task.getStatus(), 'successful');
    t.equal(task.getError(), undefined);
}));
(0, tape_1.default)('[Task] it can succeed with an synchronous callback', (t) => __awaiter(void 0, void 0, void 0, function* () {
    // Given a "pending" task that returns a number.
    const task = new index_1.Task(() => {
        t.equal(task.getStatus(), 'running');
        return 42;
    });
    t.equal(task.getResult(), undefined);
    t.equal(task.getStatus(), 'pending');
    // When we run the task.
    yield task.run();
    // Then we get the right result and it was marked as successful.
    t.equal(task.getResult(), 42);
    t.equal(task.getStatus(), 'successful');
    t.equal(task.getError(), undefined);
}));
(0, tape_1.default)('[Task] it can fail', (t) => __awaiter(void 0, void 0, void 0, function* () {
    // Given a "pending" task that throws an error.
    const task = new index_1.Task(() => {
        t.equal(task.getStatus(), 'running');
        throw new Error('Test Task Failure');
    });
    t.equal(task.getResult(), undefined);
    t.equal(task.getStatus(), 'pending');
    // When we run the task.
    try {
        yield task.run();
        t.fail('Test task should have failed');
    }
    catch (error) {
        // Then the task is marked as failed and we kept track of the error.
        t.equal(task.getStatus(), 'failed');
        t.equal(task.getResult(), undefined);
        t.equal(task.getError(), error);
    }
}));
(0, tape_1.default)('[Task] it can be aborted using an AbortController', (t) => __awaiter(void 0, void 0, void 0, function* () {
    // Given a test task that returns a number after 100ms.
    const task = new index_1.Task(() => __awaiter(void 0, void 0, void 0, function* () {
        yield new Promise((resolve) => setTimeout(resolve, 100));
        return 42;
    }));
    // And an abort controller used to cancel the task.
    const abortController = new abort_controller_1.default();
    // When we run the task and abort after 10ms.
    setTimeout(() => abortController.abort(), 10);
    try {
        yield task.run({ signal: abortController.signal });
    }
    catch (error) {
        t.equal(error.type, 'abort');
    }
    // Then the task was marked as canceled.
    t.equal(task.getStatus(), 'canceled');
    t.equal(task.getResult(), undefined);
    t.equal(task.getError().type, 'abort');
}));
(0, tape_1.default)('[Task] it can be reset', (t) => __awaiter(void 0, void 0, void 0, function* () {
    // Given a test task that ran successfully.
    const task = new index_1.Task(() => 42);
    yield task.run();
    t.equal(task.getStatus(), 'successful');
    t.equal(task.getResult(), 42);
    // When we reset the task.
    task.reset();
    // Then the task was marked as pending.
    t.equal(task.getStatus(), 'pending');
    t.equal(task.getResult(), undefined);
}));
(0, tape_1.default)('[Task] it can be loaded with a preloaded result', (t) => __awaiter(void 0, void 0, void 0, function* () {
    // Given a test task that returns a number.
    const task = new index_1.Task(() => 42);
    // When we load the task with a preloaded number.
    task.loadWith(180);
    // Then the task is marked as successful and return the preloaded number.
    t.equal(task.getStatus(), 'successful');
    t.equal(task.getResult(), 180);
    t.equal(task.getError(), undefined);
}));
(0, tape_1.default)('[Task] it can listen to status changes', (t) => __awaiter(void 0, void 0, void 0, function* () {
    // Given a helper methods that keeps track of a task's history.
    const useHistory = (task) => __awaiter(void 0, void 0, void 0, function* () {
        const history = [];
        task.onStatusChange((status) => history.push(status));
        return history;
    });
    // Then we get the right history for successful tasks.
    const l1 = new index_1.Task(() => 42);
    const h1 = yield useHistory(l1);
    yield l1.run();
    t.deepEqual(h1, ['running', 'successful']);
    // And we get the right history for failed tasks.
    const l2 = new index_1.Task(() => {
        throw new Error();
    });
    const h2 = yield useHistory(l2);
    try {
        yield l2.run();
    }
    catch (error) {
        // Fail silently...
    }
    t.deepEqual(h2, ['running', 'failed']);
    // And we get the right history for canceled tasks.
    const abortController = new abort_controller_1.default();
    setTimeout(() => abortController.abort(), 10);
    const l3 = new index_1.Task(() => __awaiter(void 0, void 0, void 0, function* () {
        yield new Promise((resolve) => setTimeout(resolve, 100));
        return 42;
    }));
    const h3 = yield useHistory(l3);
    try {
        yield l3.run({ signal: abortController.signal });
    }
    catch (error) {
        // Fail silently...
    }
    t.deepEqual(h3, ['running', 'canceled']);
    // And we get the right history for preloaded and resetted tasks.
    const l4 = new index_1.Task(() => 42);
    const h4 = yield useHistory(l4);
    l4.loadWith(180);
    l4.reset();
    t.deepEqual(h4, ['successful', 'pending']);
}));
(0, tape_1.default)('[Task] it can be given additional context', (t) => __awaiter(void 0, void 0, void 0, function* () {
    // Given a test task that returns a number.
    const task = new index_1.Task(() => 42);
    // When we provide additional context to that task
    task.setContext({
        name: 'Computing the answer to the universe',
        accuracy: 100,
    });
    // Then we can fetch that context at any time later on.
    t.same(task.getContext(), {
        name: 'Computing the answer to the universe',
        accuracy: 100,
    });
}));
(0, tape_1.default)('[Task] it can have nested tasks', (t) => __awaiter(void 0, void 0, void 0, function* () {
    // Given simple child tasks that return numbers.
    const childA = new index_1.Task(() => 1);
    const childB = new index_1.Task(() => 2);
    // When we create a parent task that use these child tasks
    const parent = new index_1.Task((options) => __awaiter(void 0, void 0, void 0, function* () {
        const resultA = yield childA.run(options);
        const resultB = yield childB.run(options);
        return resultA + resultB;
    }), [childA, childB]);
    // Then we can access its children and their progress at any time.
    t.deepEqual(parent.getChildren(), [childA, childB]);
    // And running the parent task executes the child tasks as well.
    const result = yield parent.run();
    t.equal(result, 3);
    t.equal(parent.getStatus(), 'successful');
    t.equal(childA.getStatus(), 'successful');
    t.equal(childB.getStatus(), 'successful');
}));
(0, tape_1.default)('[Task] it can return nested tasks recursively', (t) => __awaiter(void 0, void 0, void 0, function* () {
    // Given a hierarchy of tasks containing more than two levels.
    const grandChildA1 = new index_1.Task(() => { });
    const grandChildA2 = new index_1.Task(() => { });
    const childA = new index_1.Task(() => { }, [grandChildA1, grandChildA2]);
    const grandChildB1 = new index_1.Task(() => { });
    const childB = new index_1.Task(() => { }, [grandChildB1]);
    const parent = new index_1.Task(() => { }, [childA, childB]);
    // When we get the descendants of the parent task.
    const descendants = parent.getDescendants();
    // Then we get all nested children in a flat array.
    t.deepEqual(descendants, [
        childA,
        grandChildA1,
        grandChildA2,
        childB,
        grandChildB1,
    ]);
}));
const useHistoryWithNamedTasks = (tasks) => {
    const history = [];
    tasks.forEach((task) => {
        const name = task.getContext().name;
        task.onStatusChange((status) => history.push({ name, status }));
    });
    return history;
};
(0, tape_1.default)('[Task] it be used to execute tasks sequentially', (t) => __awaiter(void 0, void 0, void 0, function* () {
    // Given two child tasks.
    const childA = new index_1.Task(() => { }, [], { name: 'Child A' });
    const childB = new index_1.Task(() => { }, [], { name: 'Child B' });
    // And one parent task that use them sequentially.
    const parent = new index_1.Task(() => __awaiter(void 0, void 0, void 0, function* () {
        yield childA.run();
        yield childB.run();
    }), [childA, childB]);
    // And an history that keeps track of the child executions.
    const history = useHistoryWithNamedTasks([childA, childB]);
    // When we execute the parent task.
    yield parent.run();
    // Then we got the right execution history.
    t.deepEqual(history, [
        { name: 'Child A', status: 'running' },
        { name: 'Child A', status: 'successful' },
        { name: 'Child B', status: 'running' },
        { name: 'Child B', status: 'successful' },
    ]);
}));
(0, tape_1.default)('[Task] it be used to execute tasks in parallel', (t) => __awaiter(void 0, void 0, void 0, function* () {
    // Given two child tasks that resolve at different times.
    const childA = new index_1.Task(() => __awaiter(void 0, void 0, void 0, function* () {
        yield new Promise((resolve) => setTimeout(resolve, 100));
    }));
    childA.setContext({ name: 'Child A' });
    const childB = new index_1.Task(() => __awaiter(void 0, void 0, void 0, function* () {
        yield new Promise((resolve) => setTimeout(resolve, 50));
    }));
    childB.setContext({ name: 'Child B' });
    // And one parent task that use them in parallel.
    const parent = new index_1.Task(() => __awaiter(void 0, void 0, void 0, function* () {
        yield Promise.all([childA.run(), childB.run()]);
    }), [childA, childB]);
    // And an history that keeps track of the child executions.
    const history = useHistoryWithNamedTasks([childA, childB]);
    // When we execute the parent task.
    yield parent.run();
    // Then we got the right execution history.
    t.deepEqual(history, [
        { name: 'Child A', status: 'running' },
        { name: 'Child B', status: 'running' },
        { name: 'Child B', status: 'successful' },
        { name: 'Child A', status: 'successful' },
    ]);
}));
(0, tape_1.default)('[Task] it can require input parameters', (t) => __awaiter(void 0, void 0, void 0, function* () {
    // Given task that accepts a text and a multiplier as inputs
    // and returns the length of the text multiplied by the multiplier.
    const task = new index_1.Task((scope, text, multiplier) => {
        return text.length * multiplier;
    });
    // When we run that task by giving it the right inputs.
    const result = yield task.run({}, 'Hello World', 2);
    // Then the task was successful and returned the right result.
    t.equal(task.getStatus(), 'successful');
    t.equal(result, 22);
}));
(0, tape_1.default)('[Task] nested tasks can depend on each other via input parameters', (t) => __awaiter(void 0, void 0, void 0, function* () {
    // Given two child tasks:
    // - One that takes a text and returns its length.
    // - One that takes a number and returns its power.
    const childA = new index_1.Task((scope, text) => text.length);
    const childB = new index_1.Task((scope, value) => value * value);
    // And a parent task that composes the two child tasks.
    const parent = new index_1.Task((options) => __awaiter(void 0, void 0, void 0, function* () {
        const resultA = yield childA.run(options, 'Hello World');
        const resultB = yield childB.run(options, resultA);
        return resultB;
    }), [childA, childB]);
    // When we run that parent task.
    const result = yield parent.run();
    // Then the parent task was successful and returned the right result.
    t.equal(parent.getStatus(), 'successful');
    t.equal(result, 121);
}));
//# sourceMappingURL=Task.test.js.map