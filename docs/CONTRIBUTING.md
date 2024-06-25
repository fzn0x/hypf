# Contribution Guide

Contributions are welcome! We would be glad for your help. You can contribute in the following ways:

- Create an Issue - Propose a new feature or report a bug.
- Pull Request - Fix a bug or typo, or refactor the code.
- Share - Share your thoughts on the blog, Twitter, and other platforms.
- Use the Application - Please try to use hypf in your applications.

This project was started by Muhammad Fauzan ([@fzn0x](https://github.com/fzn0x)) for the community.

## Installing dependencies

The `fzn0x/hypf` project uses [Bun](https://bun.sh/) as its package manager. Developers should install Bun.

After that, please install the dependency environment.

```bash
bun install
```

If you can't do that, there is also a `yarn.lock` file, so you can do the same with the `yarn` command.

```bash
yarn install --frozen-lockfile
```

## PRs

Please ensure your PR passes tests with `bun run test` or `yarn test`.

## Local Development

```bash
git clone git@github.com:fzn0x/hypf.git && cd hypf
bun install

bun run build
bun run test
```

## Acknowledgements

You can ignore this error after `bun run build`:

```json
[
  {
    "resource": "/d:/Projects/hyperfetch/tsconfig.json",
    "owner": "typescript",
    "severity": 8,
    "message": "Cannot write file 'd:/Projects/hyperfetch/dist/index.d.ts' because it would overwrite input file.",
    "source": "ts",
    "startLineNumber": 1,
    "startColumn": 1,
    "endLineNumber": 1,
    "endColumn": 2
  }
]
```
