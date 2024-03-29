import hypf from "../dist/Hyperfetch.js";

(async () => {
    const hypfRequest = hypf.createRequest("https://jsonplaceholder.typicode.com"); // Pass true for DEBUG mode

    // Example usage of POST method with retry and timeout
    const [postErr, postData] = await hypfRequest.post(
        '/posts',
        { retries: 3, timeout: 5000 },
        {
            title: 'foo',
            body: 'bar',
            userId: 1,
        }
    );

    if (postErr) {
        console.error('POST Error:', postErr);
    } else {
        console.log('POST Data:', postData);
    }
})();
