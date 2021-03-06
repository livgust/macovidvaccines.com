# macovidvaccines.com

## Overview

This is the front-end software that powers www.macovidvaccines.com. Technology used is React JS. This code is uploaded to AWS whenever there is a commit to the master branch.

[![CircleCI](https://circleci.com/gh/livgust/macovidvaccines.com.svg?style=svg)](https://circleci.com/gh/livgust/macovidvaccines.com)

## Local Development

Once you've cloned the repository, follow these steps to set up a local development environment.

### Set Up Node

If you do not have NodeJS installed, please go to the [NodeJS Downloads Page](https://nodejs.org/en/download/) to download and install it. Choose the latest version corresponding to the major version number defined in `.nvmrc`.

If you use [nvm](https://github.com/nvm-sh/nvm) to manage installed versions of `node` and `npm`, switch to the node version defined in `.nvmrc` via `nvm use`. Run `nvm install` if you get a "not yet installed" error.

_**NOTE:** If you use a different major version of `node`, you may experience errors when running commands from this repo with `node` or `npm`. Additionally, please avoid running `npm install` if `npm --version` returns version `7.0.0` or greater._

Once you have `node` set up, install the modules declared in `package-lock.json`:

```sh
npm ci
```

### Start a Development Server

To run the local development server:

```sh
npm run start
```

## Code Formatting

This project use `prettier` and `eslint` to enforce good code formatting practices.

### Prettier

Prettier is "an opinionated code formatter." It is installed as a dependancy and will automatically check your code before every `git commit` (a pre-commit hook is installed via husky).

You can run Prettier within your IDE, such as automatically when saving. See the [Prettier Docs](https://prettier.io/docs/en/index.html).

To run Prettier manually, which will rewrite your code in its style:

```sh
npx prettier --write ./src
```

### ESLint

Eslint is not currently installed as a dependency. You can install it yourself via `npm install eslint` and run it manually, or use an extension provided by your IDE.

## Unit Testing

There are unit tests (\*.test.js) that can be run at anytime. They will run automatically before every `git commit` (a pre-commit hook is installed via husky). To run them manually:

```sh
npm run test
```

## Accessibility

This project uses [axe](https://www.npmjs.com/package/@axe-core/react) as a way to encourage accessibility-friendly coding practices. Axe provides feedback when running this application locally and when running tests.

This is an example of the type of feedback axe can provide in the developer console:

![axe sample report](axe-sample-report.png)

###### Copyright 2021 Olivia Adams and Ora Innovations, LLC. All rights reserved.
