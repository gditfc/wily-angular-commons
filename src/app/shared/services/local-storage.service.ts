import {Injectable} from '@angular/core';

@Injectable()
export class LocalStorageService {

  getObject(key: string): any {
    const obj: any = localStorage.getItem(key);
    if (obj) {
      return JSON.parse(obj);
    }

    return null;
  }

  getText(key: string): string {
    return localStorage.getItem(key);
  }

  putObject(key: string, object: any): void {
    localStorage.setItem(key, JSON.stringify(object));
  }

  remove(key: string): void {
    localStorage.removeItem(key);
  }

}
