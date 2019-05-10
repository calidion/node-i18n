export type ILoader = (url: string, filename: string) => Promise<JSON>;

export interface II18nOption {
  url: string;
  current: string;
  loader: ILoader;
}

export interface ILocaleTranslation {
  [key: string]: JSON;
}

export interface IStorable {
  getItem: (key: string) => string;
  setItem: (key: string, value: string) => void;
}

export type IListener = (from: string, to: string) => void;
