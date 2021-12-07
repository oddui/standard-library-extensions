# Standard Library Extensions

JavaScript standard library extensions for building complex and scalable web applications.

### Design choices

- Align with conventions and interfaces of JavaScript standard built-in objects. e.g. `TreeMap` extends the built-in `Map` interface.
- Concise code. Some methods use recursion for more compact code. e.g. most methods in `TreeMap` and the `find` method in `UnionFind`. These methods' time complexity is no worse than O(n) so it's not likely to reach the call stack limit.
- No external dependencies

## Install

Copy and paste code. Or use a package manager:

    npm install standard-library-extensions

```js
import { binarySearch } from "standard-library-extensions";
import binarySearch from "standard-library-extensions/dist/util/binarySearch";
```

## Release

    npm publish

It automatically publishes the package when a new release is created.
