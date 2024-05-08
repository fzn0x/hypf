var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import hypf from "hypf";
describe("Hyperfetch", () => {
    // TODO: create a local mock server for typicode
    const hypfRequest = hypf.createRequest("https://jsonplaceholder.typicode.com");
    it("GET", () => __awaiter(void 0, void 0, void 0, function* () {
        const [getErr, getData] = yield hypfRequest.get("/posts", {
            retries: 3,
            timeout: 5000,
        });
        if (getErr) {
            console.error("GET Error:", getErr);
        }
        else {
            console.log("GET Data:", getData);
        }
    }));
    it("POST", () => __awaiter(void 0, void 0, void 0, function* () {
        const [postErr, postData] = yield hypfRequest.post("/posts", { retries: 3, timeout: 5000 }, {
            title: "foo",
            body: "bar",
            userId: 1,
        });
        if (postErr) {
            console.error("POST Error:", postErr);
        }
        else {
            console.log("POST Data:", postData);
        }
    }));
    it("PUT", () => __awaiter(void 0, void 0, void 0, function* () {
        const [putErr, putData] = yield hypfRequest.put("/posts/1", { retries: 3, timeout: 5000 }, {
            title: "foo",
            body: "bar",
            userId: 1,
        });
        if (putErr) {
            console.error("PUT Error:", putErr);
        }
        else {
            console.log("PUT Data:", putData);
        }
    }));
    it("DELETE", () => __awaiter(void 0, void 0, void 0, function* () {
        const [deleteErr, deleteData] = yield hypfRequest.delete("/posts/1", { retries: 3, timeout: 5000 }, {
            title: "foo",
            body: "bar",
            userId: 1,
        });
        if (deleteErr) {
            console.error("DELETE Error:", deleteErr);
        }
        else {
            console.log("DELETE Data:", deleteData);
        }
    }));
});
//# sourceMappingURL=Hyperfetch.test.js.map