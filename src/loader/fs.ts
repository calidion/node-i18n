import { existsSync, readFileSync } from 'fs';
import { ILoader } from '../types';

import * as path from 'path';

export const FileSystemLoader: ILoader = async (
  dir: string,
  filename: string
): Promise<JSON> => {
  const fullname = path.resolve(dir, filename);
  if (existsSync(fullname)) {
    const json = readFileSync(fullname);
    if (json.length) {
      return JSON.parse(String(json));
    }
  }
  return JSON.parse('{}');
};
