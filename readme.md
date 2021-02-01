# Standard Library Extensions

JavaScript standard library extensions for building complex and scalable web applications.

## util

Useful algorithms and data structures.

### Design choices

- Align with convensions and interfaces of JavaScript standard built-in objects. e.g. `TreeMap` extends the built-in `Map` interface.
- Concise code
- No external depencendies

## ui

Reusable React components.

## Install

Copy and paste code. Or use a package manager:

```sh
$ npm install standard-library-extensions
```

```js
import binarySearch from 'standard-library-extensions/dist/util/binarySearch';
import { binarySearch } from 'standard-library-extensions/dist/util';
```

## Release

    npm publish

It automatically publishes the package when a new release is created.
