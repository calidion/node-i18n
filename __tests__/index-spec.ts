import * as path from 'path';
import { I18n } from '../src/index';
import { II18nOption } from '../src/types';
import { FileSystemLoader } from '../src/loader/fs';

test('Should have II18nOption available', () => {
  const a: II18nOption = {
    current: 'en',
    loader: FileSystemLoader,
    url: './locales/',

  };
  const i18n: I18n = new I18n(a);
  expect(typeof a.current).toBe('string');
  expect(typeof a.url).toBe('string');
  expect(typeof i18n.listen).toBe('function');
  expect(typeof i18n.setLocale).toBe('function');
  expect(typeof i18n.getJSON).toBe('function');
});

test('Should have load i18n data', async () => {
  const options: II18nOption = {
    current: 'en',
    loader: FileSystemLoader,
    url: path.resolve(__dirname, './locales/'),
  };

  const i18n: I18n = new I18n(options);
  const en: any = await i18n.getJSON('en');
  console.log(en);
  expect(en.a).toBe(100);
  const zhCN: any = await i18n.getJSON('zh-CN');
  expect(zhCN.b).toBe(200);
  expect(zhCN.c.d).toBe('1000');
  const enUS: any = await i18n.getJSON('en-US');
  expect(enUS).toEqual({});
  const aa: any = await i18n.getJSON('aa');
  expect(aa).toEqual({});
  const a: any = await i18n.getJSON('a');
  expect(a).toEqual({});
  await i18n.setLocale('zh');
  const locale = i18n.getLocale();
  expect(locale).toBe('zh');
});

test('Should register observers', async () => {
  const options: II18nOption = {
    current: 'en',
    loader: FileSystemLoader,
    url: path.resolve(__dirname, './locales/'),
  };

  const data: any = {
    locale: 'ja',
  };

  const storage = {
    getItem: (key: string): string => {
      return data[key];
    },
    setItem: (key: string, value: string): void => {
      data[key] = value;
    },
  };

  const i18n: I18n = new I18n(options, storage);

  let count = 0;
  i18n.listen(() => {
    count++;
  });

  i18n.listen(() => {
    count++;
  });

  const a = () => {
    count++;
  };

  i18n.listen(a);
  i18n.listen(a);
  i18n.listen(a);

  await i18n.setLocale('zh');
  expect(count).toBe(3);

  await i18n.setLocale('zh', storage);
  await i18n.setLocale('zh-CN', storage);

  delete data.locale;
  const locale = i18n.getLocale(storage);
  expect(locale).toBe('zh-CN');

  await i18n.setLocale('zh');
  const locale1 = i18n.getLocale();
  expect(locale1).toBe('zh');

  await i18n.setLocale('zh-CN');
  const t = await i18n._('c');
  expect(t).toBe('I18n Error Type: object');
  const t2 = await i18n._('c.d');
  expect(t2).toBe('1000');

  const t3 = await i18n._('c.d', 'ja');
  expect(t3).toBe('');

  const t4 = await i18n._('c.d.e.f.g');
  expect(t4).toBe('');

  const t5 = await i18n._('name', 'kr');
  expect(t5).toBe('Hello');
});
