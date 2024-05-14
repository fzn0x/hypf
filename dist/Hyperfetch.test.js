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
import fs from "node:fs";
describe("Hyperfetch", () => {
    // TODO: create a local mock server for typicode
    const hypfRequest = hypf.createRequest("https://jsonplaceholder.typicode.com");
    const hypfRequest2 = hypf.createRequest("http://localhost:3001");
    it("GET", () => __awaiter(void 0, void 0, void 0, function* () {
        var _a;
        const [getErr, getData] = yield hypfRequest.get("/posts", {
            retries: 3,
            timeout: 5000,
        });
        if (getErr) {
            console.error("GET Error:", getErr);
        }
        else {
            console.log("GET Data:", (_a = getData === null || getData === void 0 ? void 0 : getData[0]) === null || _a === void 0 ? void 0 : _a.id);
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
    it("POST:upload", () => __awaiter(void 0, void 0, void 0, function* () {
        const formdata = new FormData();
        const chunks = [];
        const stream = fs.createReadStream("C:/Users/User/Downloads/Screenshot 2024-05-14 060852.png");
        // Create a promise to handle the stream end event
        const streamEndPromise = new Promise((resolve, reject) => {
            stream.on("data", (chunk) => chunks.push(chunk));
            stream.once("end", resolve);
            stream.once("error", reject);
        });
        // Wait for the stream to finish
        yield streamEndPromise;
        // Convert chunks to Blob
        const blob = new Blob(chunks);
        formdata.append("image[]", blob);
        const [postErr, postData] = yield hypfRequest2.post("/api/upload-file", {
            body: formdata,
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