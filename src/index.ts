import { existsSync, readdirSync, readFileSync } from 'fs';
import * as path from "path";

export interface II18nOption {
  dir: string,
  current: string,
}

export interface ILocaleTranslation {
  [key: string]: JSON;
}


export interface IStorable {
  getItem: (key: string) => string,
  setItem: (key: string, value: string) => void
}

export type IListener = (from: string, to: string) => void;

export class I18n {
  protected static LOCALE: string = 'locale';
  protected static LOCALE_FILE_EXT: string = '.json';
  protected static LOCALE_REGEX: RegExp = /^([a-z]{2})(-[A-Z]{2}){0,1}\.json$/;
  protected changeObservers: IListener[] = [];
  protected translations: ILocaleTranslation = {};
  protected storage?: IStorable;
  protected options: II18nOption = {
    current: 'en',
    dir: path.resolve(__dirname, './locales'),
  };
  constructor(options?: II18nOption, storage?: IStorable) {
    if (options) {
      this.options = options;
    }
    if (storage) {
      this.storage = storage;
      this.getLocale(storage);
    }
    this.load(this.options.dir);
  }

  public get(locale: string): JSON {
    return this.translations[locale];
  }

  public setLocale(locale: string, storage?: IStorable) {
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

  protected load(dir: string) {
    if (existsSync(dir)) {
      const files = readdirSync(dir);
      files.forEach((filename) => {
        const regex = I18n.LOCALE_REGEX.test(filename);
        if (regex) {
          const fullname = path.join(dir, filename);
          const basename = path.basename(filename, I18n.LOCALE_FILE_EXT);
          const json = readFileSync(fullname);
          if (json.length) {
            this.translations[basename] = JSON.parse(String(json));
          }
        }
      })
    }
  }
}