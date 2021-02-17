# macovidvaccines.com

## Overview

This is the front-end software that powers www.macovidvaccines.com. Technology used is React JS. This code is uploaded to AWS whenever there is a commit to the master branch.

## Local Development

Once you've cloned the repository, install dependencies:

```sh
# with npm
npm ci

# with yarn
yarn
```

Then run the local development server:

```sh
# with npm
npm run start

# with yarn
yarn start

###### Copyright 2021 Olivia Adams and Ora Innovations, LLC. All rights reserved.
```

## Accessibility
This project uses [axe](https://www.npmjs.com/package/@axe-core/react) as a way to encourage accessibility-friendly coding practices. Axe provides feedback when running this application locally and when running tests.

This is an example of the type of feedback axe can provide in the developer console:

![axe sample report](axe-sample-report.png)
