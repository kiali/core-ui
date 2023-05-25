# Kiali Core

[![Kiali Core badge](https://img.shields.io/npm/v/@kiali/core-ui.svg?label=Kiali%20Core-ui&style=for-the-badge)](https://www.npmjs.com/package/@kiali/core-ui)

## Coverage Status

![Coverage lines](.badges/badge-lines.svg)
![Coverage functions](.badges/badge-functions.svg)
![Coverage branches](.badges/badge-branches.svg)
![Coverage statements](.badges/badge-statements.svg)

## Development Setup

In order to work and test locally with Kiali core components you have to link the library with a UI application through `yarn link`.

Assuming your working directory tree is:

```
-- work
|- application-ui
|- core-ui
```

Before linking core-ui and types libraries, react, react-dom and react-redux dependencies from application ui need to be linked to use same version in both places.

```sh
cd work/application-ui
# Install application-ui dependencies
yarn install

# Sometimes, yarn link is ignored because there is a link of same library in another place.
# In this case you have to unlink first with yarn unlink (https://github.com/yarnpkg/yarn/issues/7216)

cd work/application-ui/node_modules/react
# Create link for react
yarn link

cd work/application-ui/node_modules/react-dom
# Create link for react-dom
yarn link

cd work/application-ui/node_modules/react-redux
# Create link for react-redux
yarn link
```

Then core-ui library link is created and use react and react-dom links in the library.

```sh
# Install core-ui library dependencies
yarn install

cd work/core-ui
# Link react library
yarn link react

# Link react-dom library
yarn link react-dom

# Link react-dom library
yarn link react-redux

cd work/core-ui/packages/core-ui
# Create link for core-ui
yarn link

cd work/core-ui/packages/types
# Create link for core-ui
yarn link
```

Finally use core-ui link in the application.

```sh
cd work/application-ui
# Link core-ui and types libraries
yarn link @kiali/core-ui
yarn link @kiali/types
```

After testing Kiali core components, you should remove the links:

```sh
cd work/application-ui
# Unlink core-ui and types libraries
yarn unlink @kiali/core-ui
yarn unlink @kiali/types

# Reinstalling application-ui dependencies
yarn install

cd work/core-ui/packages/core-ui
# Unlink react library
yarn unlink react

# Unlink react-dom library
yarn unlink react-dom

# Unlink react-redux library
yarn unlink react-redux

cd work/core-ui
# Reinstalling core-ui dependencies
yarn install
```

## Semantic Commit Messages

We should set commit message with this format:

Format: `<type>(<scope>): <subject>`

`<scope>` is optional

### Example

```
feat: add hat wobble
^--^  ^------------^
|     |
|     +-> Summary in present tense.
|
+-------> Type: chore, docs, feat, fix, refactor, style, or test.
```

More Examples:

- `major`: A new version with breaking changes
- `feat`: (new feature for the user, not a new feature for build script)
- `fix`: (bug fix for the user, not a fix to a build script)

Follow these [instruction](https://github.com/semantic-release/semantic-release)
