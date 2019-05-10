import { ILoader } from "../types";

export const PlaceHolderLoader: ILoader = (url: string): Promise<JSON> => {
  url = "{}";
  return Promise.resolve(JSON.parse(url));
}