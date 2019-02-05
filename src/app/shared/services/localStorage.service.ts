import {Injectable} from '@angular/core';

@Injectable()
export class LocalStorageService {

  getObject(key: string) {
    const obj: any = localStorage.getItem(key);
    if (obj) {
      return JSON.parse(obj);
    }

    return null;
  }

  getText(key: string) {
    return localStorage.getItem(key);
  }

  putObject(key: string, object: any) {
    localStorage.setItem(key, JSON.stringify(object));
  }

}
