# node-fix-path

> Fix the `$PATH` on macOS and Linux when run from a GUI app

Useful for Electron apps as GUI apps on macOS and Linux do not inherit the `$PATH` defined in your dotfiles \_(.bashrc/.bash_profile/.zshrc/etc).

Fully self contained and bundled.

## Install

```
npm install node-fix-path
```

or

```
yarn add node-fix-path
```

## Usage

```js
import { fixPath } from "node-fix-path";

console.log(process.env.PATH);
//=> '/usr/bin'

fixPath();

console.log(process.env.PATH);
//=> '/usr/local/bin:/usr/bin'
```

## Related

- [shell-path](https://github.com/sindresorhus/shell-path) - Get the `$PATH` from the shell
- [fix-path](https://github.com/sindresorhus/fix-path) - Same package but only with esm support
