[![Build Status](https://travis-ci.org/calidion/node-i18n.svg?branch=master)](https://travis-ci.org/calidion/node-i18n)
[![Coverage Status](https://coveralls.io/repos/github/calidion/node-i18n/badge.svg?branch=master)](https://coveralls.io/github/calidion/node-i18n?branch=master)
[![MIT license](http://img.shields.io/badge/license-MIT-brightgreen.svg)](http://opensource.org/licenses/MIT)

# Simplest I18n Solution for all platforms

This may be the simplest i18n module for nodejs and the web.

# Locale Directory

```
locales/
├── en.json
├── en-US.json
├── kr.json
└── zh-CN.json
```

> All locale files must be kept within one directory, with file extension `.json` and in json format.

# Install

```
yarn add node-i18n-core
# or 
npm install node-i18n-core
```
# Usage

## import

```ts
import { I18n, II18nOption, IStorable, IListener } from 'node-i18n-core';
```

## Options

There are three options in II18nOption.

1. `current`: the current locale.
2. `url`: an absolute path of file system or uri.
3. `loader`: an async function through which locale data is read asynchronously

## Loaders

There are two Loaders, one is `FileSystemLoader`, the other is `HTTPLoader`.

As their names imply, one is for file system, the other is for web served json files.

### FileSystemLoader

> `url` should be an absolute path

```ts
  const options: II18nOption = {
    current: 'en',
    loader: FileSystemLoader,
    url: path.resolve(__dirname, './locales/'),
  };
```

### HTTPLoader

> `url` should be an uri path where json files are served

```ts
  const options: II18nOption = {
    current: 'en',
    loader: HTTPLoader,
    url: 'http://www.yourdomain.com/xxx/locales/'
  };
```

## Create I18n Instance

You can specify your storage or not.

```ts
const i18n = new I18n(options);

// Use windows.localStorage as the IStorable interface on the web
const i18n = new I18n(options, windows.localStorage);
```

## Init data

To use translator, data must be initialized at first:

```ts
await i18n.init();
```

Now you have the json data prepared for access.

## Get Locale

```ts
// Get Locale loaded from windows.localStorage
i18n.getLocale();
```

## Define Customzied IStorable object


```ts

// Define an IStorable for yourself
const storage: IStorable = {
    getItem: (key: string): string => {
      return data[key];
    },
    setItem: (key: string, value: string): void => {
      data[key] = value;
    }
};

// Get Locale from a customzied IStorable instance
i18n.getLocale(storage);
```

## Set Locale (Async)

```ts
// Set Locale to constructed storage
await i18n.setLocale('zh-CN');

// Set Locale to a temporay storage
await i18n.setLocale('zh-CN', storage);
```


## Add Change Observer

```ts
// Listen the locale change infomation
const listener: IListener = (from, to) => {
  console.log("locale has changed from: " + from + " to :" + to );
};
i18n.listen(listener);
```

## Get Translation (Async)

```ts
// Get translated strings async
await i18n._('TITLE');
await i18n._('TITLE.SUBTITLE.SUBTITLE');
await i18n._('TITLE', 'zh-CN');
await i18n._('TITLE.SUBTITLE.SUBTITLE', 'ja');

// Get translated strings, no await need, return '' if not loaded or error.
 i18n._sync('TITLE');
 i18n._sync('TITLE.SUBTITLE.SUBTITLE');
 i18n._sync('TITLE', 'zh-CN');
 i18n._sync('TITLE.SUBTITLE.SUBTITLE', 'ja');
```
