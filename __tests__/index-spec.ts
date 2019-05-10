import * as path from 'path';
import { I18n, II18nOption } from '../src/index';

test('Should have II18nOption available', () => {
  const a: II18nOption = {
    current: 'en',
    dir: './locales',
  };
  const i18n: I18n = new I18n();
  expect(typeof a.current).toBe('string');
  expect(typeof a.dir).toBe('string');
  expect(typeof i18n.listen).toBe('function');
  expect(typeof i18n.setLocale).toBe('function');
  expect(typeof i18n.get).toBe('function');
});

test('Should have load i18n data', () => {
  const options: II18nOption = {
    current: 'en',
    dir: path.resolve(__dirname, './locales'),
  };

  const i18n: I18n = new I18n(options);
  const en: any = i18n.get('en');
  expect(en.a).toBe(100);
  const zhCN: any = i18n.get('zh-CN');
  expect(zhCN.b).toBe(200);
  expect(zhCN.c.d).toBe(1000);
  const enUS: any = i18n.get('en-US');
  expect(enUS).toBeFalsy();
  const aa: any = i18n.get('aa');
  expect(aa).toBeFalsy();
  const a: any = i18n.get('a');
  expect(a).toBeFalsy();
  i18n.setLocale("zh");
  const locale = i18n.getLocale();
  expect(locale).toBe('zh');
});


test('Should register observers', () => {
  const options: II18nOption = {
    current: 'en',
    dir: path.resolve(__dirname, './locales'),
  };

  const data: any = {
    'locale': "ja"
  };

  const storage = {
    getItem: (key: string): string => {
      return data[key];
    },
    setItem: (key: string, value: string): void => {
      data[key] = value;
    }
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

  i18n.setLocale("zh");
  expect(count).toBe(3);

  i18n.setLocale("zh", storage);
  i18n.setLocale("zh-CN", storage);

  delete data.locale;
  const locale = i18n.getLocale(storage);
  expect(locale).toBe('zh-CN');

  i18n.setLocale("zh");
  const locale1 = i18n.getLocale();
  expect(locale1).toBe('zh');
});
