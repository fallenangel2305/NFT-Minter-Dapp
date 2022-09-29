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
exports.isMetaplexFile = exports.getBrowserFileFromMetaplexFile = exports.getBytesFromMetaplexFiles = exports.parseMetaplexFileContent = exports.toMetaplexFileFromJson = exports.toMetaplexFileFromBrowser = exports.toMetaplexFile = void 0;
const buffer_1 = require("buffer");
const utils_1 = require("../../utils");
const errors_1 = require("../../errors");
const toMetaplexFile = (content, fileName, options = {}) => {
    var _a, _b, _c, _d, _e;
    return ({
        buffer: (0, exports.parseMetaplexFileContent)(content),
        fileName: fileName,
        displayName: (_a = options.displayName) !== null && _a !== void 0 ? _a : fileName,
        uniqueName: (_b = options.uniqueName) !== null && _b !== void 0 ? _b : (0, utils_1.randomStr)(),
        contentType: (_c = options.contentType) !== null && _c !== void 0 ? _c : (0, utils_1.getContentType)(fileName),
        extension: (_d = options.extension) !== null && _d !== void 0 ? _d : (0, utils_1.getExtension)(fileName),
        tags: (_e = options.tags) !== null && _e !== void 0 ? _e : [],
    });
};
exports.toMetaplexFile = toMetaplexFile;
const toMetaplexFileFromBrowser = (file, options = {}) => __awaiter(void 0, void 0, void 0, function* () {
    const buffer = yield file.arrayBuffer();
    return (0, exports.toMetaplexFile)(buffer, file.name, options);
});
exports.toMetaplexFileFromBrowser = toMetaplexFileFromBrowser;
const toMetaplexFileFromJson = (json, fileName = 'inline.json', options = {}) => {
    let jsonString;
    try {
        jsonString = JSON.stringify(json);
    }
    catch (error) {
        throw new errors_1.InvalidJsonVariableError({ cause: error });
    }
    return (0, exports.toMetaplexFile)(jsonString, fileName, options);
};
exports.toMetaplexFileFromJson = toMetaplexFileFromJson;
const parseMetaplexFileContent = (content) => {
    if (content instanceof ArrayBuffer) {
        return buffer_1.Buffer.from(new Uint8Array(content));
    }
    return buffer_1.Buffer.from(content);
};
exports.parseMetaplexFileContent = parseMetaplexFileContent;
const getBytesFromMetaplexFiles = (...files) => files.reduce((acc, file) => acc + file.buffer.byteLength, 0);
exports.getBytesFromMetaplexFiles = getBytesFromMetaplexFiles;
const getBrowserFileFromMetaplexFile = (file) => new File([file.buffer], file.fileName);
exports.getBrowserFileFromMetaplexFile = getBrowserFileFromMetaplexFile;
const isMetaplexFile = (metaplexFile) => {
    return (metaplexFile != null &&
        typeof metaplexFile === 'object' &&
        'buffer' in metaplexFile &&
        'fileName' in metaplexFile &&
        'displayName' in metaplexFile &&
        'uniqueName' in metaplexFile &&
        'contentType' in metaplexFile &&
        'extension' in metaplexFile &&
        'tags' in metaplexFile);
};
exports.isMetaplexFile = isMetaplexFile;
//# sourceMappingURL=MetaplexFile.js.map