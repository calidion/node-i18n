import * as axios from 'axios';
import { ILoader } from "../types";


export const AxiosLoader: ILoader = (url: string): Promise<JSON> => {

  try {
    return Promise.resolve(axios.get(url).data);
  } catch(e) {
    return Promise.resolve(JSON.parse("{}"));
  }
}