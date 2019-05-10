import { existsSync, readFileSync } from 'fs';
import { ILoader } from "../types";

import * as path from "path";

export const FileSystemLoader: ILoader = (dir: string, filename: string): Promise<JSON> => {
  const fullname = path.resolve(dir, filename);
  console.log(fullname);
  if (existsSync(fullname)) {
    const json = readFileSync(fullname);
    if (json.length) {
      return Promise.resolve(JSON.parse(String(json)));
    }
  }
  return Promise.resolve(JSON.parse("{}"));
}