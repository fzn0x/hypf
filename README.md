<p align="center" width="100%">
    <img width="55%" src="./assets/hyperfetch.png">
</p>

<hr />

[![GitHub Workflow Status](https://img.shields.io/github/actions/workflow/status/fzn0x/hypf/ci.yml?branch=main)](https://github.com/fzn0x/hypf/actions)
[![GitHub](https://img.shields.io/github/license/fzn0x/hypf)](https://github.com/fzn0x/hypf/blob/main/LICENSE)
[![npm](https://img.shields.io/npm/v/hypf)](https://www.npmjs.com/package/hypf)
[![npm](https://img.shields.io/npm/dm/hypf)](https://www.npmjs.com/package/hypf)
[![JSR](https://jsr.io/badges/@fzn0x/hypf)](https://jsr.io/@fzn0x/hypf)
[![Bundle Size](https://img.shields.io/bundlephobia/min/hypf)](https://bundlephobia.com/result?p=hypf)
[![Bundle Size](https://img.shields.io/bundlephobia/minzip/hypf)](https://bundlephobia.com/result?p=hypf)
[![GitHub commit activity](https://img.shields.io/github/commit-activity/m/fzn0x/hypf)](https://github.com/fzn0x/hypf/pulse)
[![GitHub last commit](https://img.shields.io/github/last-commit/fzn0x/hypf)](https://github.com/fzn0x/hypf/commits/main)

<hr />

Small (6.3kB minified & 0 dependencies) and type-powered HTTP client for Deno, Bun, Node.js, Cloudflare Workers and Browsers. 🚀

The most flexible fetch wrapper that allows you to have more than one practice to get things done!

## Table of Contents

- [Get Started](#get-started)
- [Error Handling](#error-handling)
- [Response Cloning](#response-cloning)
- [Request Cloning](#request-cloning)
- [Dry Run](#dry-run)
- [Hooks](#hooks)
- [Retry Mechanism](#retry-mechanism)
- [Infer Response Types](#infer-response-types)
  - [URLSearchParams](#urlsearchparams)
  - [Form Data](#form-data)
  - [AbortController](#abortcontroller)
  - [Debug](#debug)
- [Acknowledgements](#acknowledgements)
- [License](#license)

## Get Started

```sh
# Node.js
npm install hypf
# Bun
bun install hypf
```

The idea of this tool is to provide lightweight `fetch` wrapper for Node.js, Bun:

```ts
import hypf from 'hypf'

const hypfRequest = hypf.init('https://jsonplaceholder.typicode.com')

// Example usage of POST method with retry and timeout
const [postErr, postData] = await hypfRequest.post(
  '/posts',
  { retries: 3, timeout: 5000 },
  {
    title: 'foo',
    body: 'bar',
    userId: 1,
  }
)

if (postErr) {
  console.error('POST Error:', postErr)
} else {
  console.log('POST Data:', postData)
}
```

Cloudflare Workers:

```ts
export default {
  async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
    const hypfInstance = await hypf.init('https://jsonplaceholder.typicode.com')

    const [getErr, getData] = await hypfInstance.get<
      Array<{
        userId: number
        id: number
        title: string
        body: string
      }>
    >('/posts')

    if (getErr) {
      console.error('GET Error:', getErr)
    }

    return Response.json(getData)
  },
}
```

and Browsers:

```html
<script src="https://unpkg.com/hypf/browser/hyperfetch-browser.min.js"></script>

<script>
  ;(async () => {
    const request = hypf.default.init('https://jsonplaceholder.typicode.com')
  })()
</script>
```

## Error Handling

You can handle errors like [Error handling on Golang](https://go.dev/blog/error-handling-and-go)

```ts
const hypfRequest = hypf.init('https://jsonplaceholder.typicode.com')

// Example usage of POST method with retry and timeout
const [postErr, postData] = await hypfRequest.post(
  '/posts',
  { retries: 3, timeout: 5000 },
  {
    title: 'foo',
    body: 'bar',
    userId: 1,
  }
)

if (postErr) {
  console.error('POST Error:', postErr)
} else {
  console.log('POST Data:', postData)
}
```

or since `v0.2.2` throw on error with `throwOnError` options sets `true`

```ts
const hypfRequest = hypf.init('https://jsonplaceholder.typicode.com')

try {
  const response = await hypfRequest.post(
    '/posts',
    { retries: 3, timeout: 5000, initOptions: { throwOnError: true } },
    {
      title: 'foo',
      body: 'bar',
      userId: 1,
    }
  )

  console.log(response)
} catch (err) {
  console.log(err)
}
```

## Response Cloning

You need to use `throwOnError: true` to enable Response clone feature.

```ts
const res = await hypfRequest.get(
  'https://jsonplaceholder.typicode.com/todos/1',
  {},
  {},
  {
    throwOnError: true,
  }
)

const response2 = res.clone()

expect(res).to.be.an.instanceOf(Response)
expect(response2).to.be.an.instanceOf(Response)
expect(await res.json()).to.be.an.instanceOf(Object)
expect(await response2.json()).to.be.an.instanceOf(Object)
```

## Request Cloning & Dry Run

Dry Run is supported in hypf, you can calling hypf requests without executing it!

This enables more features in the future and also Request cloning:

```ts
const req = await hypfRequest.get(
  'https://jsonplaceholder.typicode.com/todos/1',
  {
    dryRun: true,
  },
  {},
  {
    throwOnError: true,
  }
)

const req2 = req.clone()

expect(req).to.be.an.instanceOf(Request)
expect(req2).to.be.an.instanceOf(Request)
```

## Hooks

Hooks is supported and expected to not modifying the original result by design.

```ts
const hooks = {
  preRequest: (url, options) => {
    console.log(`Preparing to send request to: ${url}`)
    // You can perform actions before the request here
  },
  postRequest: (url, options, data, response) => {
    console.log(`Request to ${url} completed with status: ${response?.[0] ? 'error' : 'success'}`)
    // You can perform actions after the request here, including handling errors
  },
}

const requestWithHooks = hypf.init('https://jsonplaceholder.typicode.com', { hooks })

// Example usage of POST method with retry and timeout
const [postErr, postData] = await requestWithHooks.post(
  '/posts',
  { retries: 3, timeout: 5000 },
  {
    title: 'foo',
    body: 'bar',
    userId: 1,
  }
)
```

List of Hooks:

```ts
export interface Hooks {
  preRequest?: (url: string, options: RequestOptions) => void
  postRequest?: <T, U>(
    url: string,
    options: RequestOptions,
    data?: T,
    response?: [Error | null, U]
  ) => void
  preRetry?: (url: string, options: RequestOptions, retryCount: number, retryLeft: number) => void
  postRetry?: <T, U>(
    url: string,
    options: RequestOptions,
    data?: T,
    response?: [Error | null, U],
    retryCount?: number,
    retryLeft?: number
  ) => void
  preTimeout?: (url: string, options: RequestOptions) => void
  postTimeout?: (url: string, options: RequestOptions) => void
}
```

## Retry Mechanism

You can retry your request once it's failed!

```ts
const [postErr, postData] = await requestWithHooks.post(
  '/posts',
  { retries: 3, timeout: 5000 },
  {
    title: 'foo',
    body: 'bar',
    userId: 1,
  }
)
```

Jitter and backoff also supported. 😎

```ts
const [postErr, postData] = await requestWithHooks.post(
  '/posts',
  { retries: 3, timeout: 5000, jitter: true }, // false `jitter` to use backoff
  {
    title: 'foo',
    body: 'bar',
    userId: 1,
  }
)
```

You can modify backoff and jitter factor as well.

```ts
const [postErr, postData] = await requestWithHooks.post(
  '/posts',
  { retries: 3, timeout: 5000, jitter: true, jitterFactor: 10000 }, // false `jitter` to use backoff
  {
    title: 'foo',
    body: 'bar',
    userId: 1,
  }
)

// or backoff

const [postErr, postData] = await requestWithHooks.post(
  '/posts',
  { retries: 3, timeout: 5000, jitter: false, backoffFactor: 10000 }, // false `jitter` to use backoff
  {
    title: 'foo',
    body: 'bar',
    userId: 1,
  }
)
```

Retry on timeout also supported.

```ts
const [postErr, postData] = await requestWithHooks.post(
  '/posts',
  { retries: 3, timeout: 5000, retryOnTimeout: true },
  {
    title: 'foo',
    body: 'bar',
    userId: 1,
  }
)
```

## Infer Response Types

```ts
const [getErr, getData] = await hypfRequest.get<
  Array<{
    userId: number
    id: number
    title: string
    body: string
  }>
>('/posts', {
  retries: 3,
  timeout: 5000,
})

getData?.[0]?.id // number | undefined
```

### URLSearchParams

```ts
const [getErr, getData] = await hypfRequest.get('/posts', {
  retries: 3,
  timeout: 5000,
  params: {
    id: 1,
  },
}) // /posts?id=1
```

### Form Data

Example usecase for Upload File:

```ts
export async function postImportFile(formData: FormData) {
  const [postErr, postData] = await hypfRequest.post(`/api/upload-file/import`, {
    body: formData,
  })

  if (postErr) {
    throw postErr
  }

  return postData
}
```

### AbortController

We expose abort controller, you can cancel next request anytime.

```ts
// DELETE will not work if you uncomment this
const controller = requestWithHooks.getAbortController()

controller.abort()

// Example usage of DELETE method with retry and timeout
const [deleteErr, deleteData] = await requestWithHooks.delete('/posts/1', {
  retries: 3,
  timeout: 5000,
})

if (deleteErr) {
  console.error('DELETE Error:', deleteErr)
} else {
  console.log('DELETE Data:', deleteData)
}
```

### debug

Debugging the library is possible but limited. You can pass `true` to `debug` option:

```ts
const requestWithHooks = hypf.init('https://jsonplaceholder.typicode.com', { debug: true })
```

This is designed to be useful to track an issue. Submit a PR to debug more areas in the code!

## Acknowledgements

Hyperfetch is highly inspired by [Hono](https://github.com/honojs/hono), Got, Ky and Axios

## License

Hyperfetch is [MIT-licensed](./LICENSE) and Open Source Software by [fzn0x](https://github.com/fzn0x) and [contributors from Hono and the Hyperfetch community](https://github.com/fzn0x/hypf/graphs/contributors):

<a href="https://github.com/fzn0x/hypf/graphs/contributors">
  <img src="https://contrib.rocks/image?repo=fzn0x/hypf" />
</a>
