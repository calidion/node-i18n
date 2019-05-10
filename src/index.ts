export * from './types';
export { PlaceHolderLoader } from './loader/place-holder';
export { FileSystemLoader } from './loader/fs';
export { HTTPLoader } from './loader/http';

import { II18nOption, IListener, ILocaleTranslation, IStorable } from './types';

import { PlaceHolderLoader } from './loader/place-holder';

export class I18n {
  public static LOCALE: string = 'locale';
  public static LOCALE_FILE_EXT: string = '.json';
  public static LOCALE_REGEX: RegExp = /^([a-z]{2})(-[A-Z]{2}){0,1}$/;
  protected changeObservers: IListener[] = [];
  protected translations: ILocaleTranslation = {};
  protected storage?: IStorable;
  protected options: II18nOption = {
    current: 'en',
    loader: PlaceHolderLoader,
    url: '',
  };
  constructor(options: II18nOption, storage?: IStorable) {
    this.options = options;
    if (storage) {
      this.storage = storage;
      this.getLocale(storage);
    }
  }

  public async init() {
    await this.setLocale(this.options.current, this.storage);
  }

  public async _(key: string, locale?: string): Promise<string> {
    if (!locale) {
      locale = this.options.current;
    }
    return this.getTranslation(key, await this.getJSON(locale));
  }

  public _sync(key: string, locale?: string): string {
    if (!locale) {
      locale = this.options.current;
    }
    return this.getTranslation(key, this.translations[locale]);
  }

  public getTranslation(key: string, translation: any): string {
    const keys = key.split('.');
    keys.forEach((k: string) => {
      if (translation) {
        translation = translation[k];
      }
    });

    if (!translation) {
      return '';
    }
    if (typeof translation !== 'string') {
      return 'I18n Error Type: ' + typeof translation;
    }
    return translation;
  }

  public async getJSON(locale: string): Promise<JSON> {
    if (!I18n.LOCALE_REGEX.test(locale)) {
      return JSON.parse('{}');
    }
    if (!this.translations[locale]) {
      const filename = locale + I18n.LOCALE_FILE_EXT;
      this.translations[locale] = await this.options.loader(
        this.options.url,
        filename
      );
    }
    return this.translations[locale];
  }

  public async setLocale(locale: string, storage?: IStorable) {
    await this.getJSON(locale);
    if (locale !== this.options.current) {
      const from = this.options.current;
      this.options.current = locale;
      if (storage) {
        storage.setItem(I18n.LOCALE, locale);
      } else if (this.storage) {
        this.storage.setItem(I18n.LOCALE, locale);
      }
      this.notify(from, locale);
    }
  }

  public getLocale(storage?: IStorable) {
    if (storage) {
      const current = storage.getItem(I18n.LOCALE);
      if (current) {
        this.options.current = current;
        return current;
      }
    }
    return this.options.current;
  }

  public listen(observer: IListener) {
    if (this.changeObservers.indexOf(observer) === -1) {
      this.changeObservers.push(observer);
    }
  }

  protected notify(from: string, to: string) {
    this.changeObservers.forEach(observer => observer(from, to));
  }
}
