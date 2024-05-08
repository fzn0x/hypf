import hypf from "node:hypf";

describe("Hyperfetch", () => {
  // TODO: create a local mock server for typicode
  const hypfRequest = hypf.createRequest(
    "https://jsonplaceholder.typicode.com"
  );

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
