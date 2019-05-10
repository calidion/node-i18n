import { ILoader } from '../types';

export const PlaceHolderLoader: ILoader = async (
  url: string
): Promise<JSON> => {
  url = '{}';
  return Promise.resolve(JSON.parse(url));
};
