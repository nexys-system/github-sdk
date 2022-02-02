# Github SDK

[![npm version](https://img.shields.io/npm/v/@nexys/github-sdk.svg)](https://www.npmjs.com/package/@nexys/github-sdk)
[![Build and Test Package](https://github.com/nexys-system/github-sdk/actions/workflows/test.yml/badge.svg)](https://github.com/nexys-system/github-sdk/actions/workflows/test.yml)
[![Publish](https://github.com/nexys-system/github-sdk/actions/workflows/publish.yml/badge.svg)](https://github.com/nexys-system/github-sdk/actions/workflows/publish.yml)
![Code style](https://img.shields.io/badge/code_style-prettier-ff69b4.svg)
[![Bundlephobia](https://badgen.net/bundlephobia/min/@nexys/github-sdk)](https://bundlephobia.com/result?p=@nexys/github-sdk)

## Get started

### Install

`yarn add @nexys/github-sdk`

### Integrate in code

```
import { Rest } from "@nexys/github-sdk";

// example: update repo
Rest.Repo.update(
  {description: 'my new repo description'},
  'my organization',
  'myrepo',
  'mytoken'
).then(response => {
  console.log({response});
})
```
