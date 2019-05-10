import { default as axios } from 'axios';
import { ILoader } from '../types';

export const HTTPLoader: ILoader = async (
  url: string,
  filename: string
): Promise<JSON> => {
  try {
    const response = await axios.get(url + filename);
    return response.data;
  } catch (e) {
    return JSON.parse('{}');
  }
};
