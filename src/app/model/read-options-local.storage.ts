import { Directory } from '@capacitor/filesystem';

export interface ReadOptionsLocalStorage {
  path: string;
  directory?: Directory;
}
