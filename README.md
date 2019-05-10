[![Build Status](https://travis-ci.org/calidion/node-i18n.svg?branch=master)](https://travis-ci.org/calidion/node-i18n.svg?branch=master)
[![Coverage Status](https://coveralls.io/repos/github/calidion/node-i18n/badge.svg?branch=master)](https://coveralls.io/github/calidion/node-i18n?branch=master)
[![MIT license](http://img.shields.io/badge/license-MIT-brightgreen.svg)](http://opensource.org/licenses/MIT)

# Simplest I18n Solution for all platforms

This may be the simplest i18n module for nodejs and the web.

```ts
import { I18n, II18nOption, IStorable, IListener } from 'node-i18n-core';
const options: II18nOption = {
  current: 'en',                              // Use current because default is not allowed here.
  dir: path.resolve(__dirname, './locales'),  // Absolute path
};

const i18n = new I18n(options);

// Use windows.localStorage as the IStorable interface on the web
const i18n = new I18n(options, windows.localStorage);

// Get Locale loaded from windows.localStorage
i18n.getLocale();

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

// Set Locale to constructed storage
i18n.setLocale('zh-CN');

// Set Locale to a temporay storage
i18n.setLocale('zh-CN', storage);

// Listen the locale change infomation
const listener: IListener = (from, to) => {
  console.log("locale has changed from: " + from + " to :" + to );
};
i18n.listen(listener);

// Get translated strings
i18n._('TITLE');
i18n._('TITLE.SUBTITLE.SUBTITLE');
i18n._('TITLE', 'zh-CN');
i18n._('TITLE.SUBTITLE.SUBTITLE', 'ja');

```