import hypf from "../dist/index.ts";

describe("init", () => {
  // TODO: create a local mock server for typicode
  const hypfRequest = hypf.init("https://jsonplaceholder.typicode.com");

  // only uncomment for upload file testing purposes
  // const hypfRequest2 = hypf.init("http://localhost:3001");

  it("GET", async () => {
    const [getErr, getData] = await hypfRequest.get<
      Array<{
        userId: number;
        id: number;
        title: string;
        body: string;
      }>
    >("/posts", {
      retries: 3,
      timeout: 5000,
    });

    if (getErr) {
      console.error("GET Error:", getErr);
    } else {
      console.log("GET Data:", getData?.[0]?.id);
    }
  });

  it("POST", async () => {
    const [postErr, postData] = await hypfRequest.post(
      "/posts",
      { retries: 3, timeout: 5000 },
      {
        title: "foo",
        body: "bar",
        userId: 1,
      }
    );

    if (postErr) {
      console.error("POST Error:", postErr);
    } else {
      console.log("POST Data:", postData);
    }
  });

  // it("POST:upload", async () => {
  //   const formdata = new FormData();
  //   const chunks: BlobPart[] = [];

  //   const stream = fs.createReadStream(
  //     "C:/Users/User/Downloads/Screenshot 2024-05-14 060852.png"
  //   );

  //   // Create a promise to handle the stream end event
  //   const streamEndPromise = new Promise((resolve, reject) => {
  //     stream.on("data", (chunk) => chunks.push(chunk));
  //     stream.once("end", resolve);
  //     stream.once("error", reject);
  //   });

  //   // Wait for the stream to finish
  //   await streamEndPromise;

  //   // Convert chunks to Blob
  //   const blob = new Blob(chunks);
  //   formdata.append("image[]", blob);

  //   const [postErr, postData] = await hypfRequest2.post("/api/upload-file", {
  //     body: formdata,
  //   });

  //   if (postErr) {
  //     console.error("POST Error:", postErr);
  //   } else {
  //     console.log("POST Data:", postData);
  //   }
  // });

  it("PUT", async () => {
    const [putErr, putData] = await hypfRequest.put(
      "/posts/1",
      { retries: 3, timeout: 5000 },
      {
        title: "foo",
        body: "bar",
        userId: 1,
      }
    );

    if (putErr) {
      console.error("PUT Error:", putErr);
    } else {
      console.log("PUT Data:", putData);
    }
  });

  it("DELETE", async () => {
    const [deleteErr, deleteData] = await hypfRequest.delete(
      "/posts/1",
      { retries: 3, timeout: 5000 },
      {
        title: "foo",
        body: "bar",
        userId: 1,
      }
    );

    if (deleteErr) {
      console.error("DELETE Error:", deleteErr);
    } else {
      console.log("DELETE Data:", deleteData);
    }
  });
});
