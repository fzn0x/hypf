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
(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "./Hyperfetch"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    const Hyperfetch_1 = __importDefault(require("./Hyperfetch"));
    // Example usage with hooks and retry on timeout
    const hooks = {
        preRequest: (url, options) => {
            console.log(`Preparing to send request to: ${url}`);
            // You can perform actions before the request here
        },
        postRequest: (url, options, data, response) => {
            console.log(`Request to ${url} completed with status: ${(response === null || response === void 0 ? void 0 : response[0]) ? 'error' : 'success'}`);
            // You can perform actions after the request here, including handling errors
        },
    };
    // Example usage with functional programming and hooks
    (() => __awaiter(void 0, void 0, void 0, function* () {
        const requestWithHooks = (0, Hyperfetch_1.default)("https://jsonplaceholder.typicode.com", hooks, true); // Pass true for DEBUG mode
        // Example usage of GET method with retry and timeout
        const [getErr, getData] = yield requestWithHooks.get('/todos/1', { retries: 3, timeout: 5000 });
        if (getErr) {
            console.error('GET Error:', getErr);
        }
        else {
            console.log('GET Data:', getData);
        }
    }))();
});
//# sourceMappingURL=examples.js.map