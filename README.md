# mocha-watch

[![npm version](https://badge.fury.io/js/%40gustavnikolaj%2Fmocha-watch.svg)](https://www.npmjs.com/package/@gustavnikolaj/mocha-watch)
[![Build Status](https://travis-ci.com/gustavnikolaj/mocha-watch.svg?branch=master)](https://travis-ci.com/gustavnikolaj/mocha-watch)
[![Coverage Status](https://coveralls.io/repos/github/gustavnikolaj/mocha-watch/badge.svg?branch=master)](https://coveralls.io/github/gustavnikolaj/mocha-watch?branch=master)

In development - work in progress!

Run tests associated to changed files (based on git status).

```
$ npm install --save-dev @gustavnikolaj/mocha-watch
```

or...

```
$ yarn add -D @gustavnikolaj/mocha-watch
```

Run the tests related to the changed files:

```
$ mocha-watch
```

## Description

When the cli is started, it will map out the test files and each of the source
files that they depend on - this is done through the `SourceGraph` class.

Then it looks at the dirty files (determined by running `git status`) and checks
which of the test files would be relevant to run based on which files has been
changed.

The tests are being run by mocha itself - a process is forked off from which
mocha is loaded. This happens on every single run to make sure that there is no
pollution between test runs. This is the responsibility of the `MochaWorker` class.

The orchestration of the above, and the watching of files are handled within the
`MochaWatch` class.

## Known limitations

### Dynamic imports

With `require` it is possible to do dynamic imports. This tool only supports
dependencies that are statically analyzable.

```js
// This will not work...

const pathToModule = "../myModule";
require(pathToModule);
```
