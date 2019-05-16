import {Injectable} from '@angular/core';

/**
 * Wrapper around interactions with Local Storage. Handles serializing things to JSON to make it easier to push more complex data into
 * local storage.
 */
@Injectable()
export class LocalStorageService {

  /**
   * Retrieve an object from LocalStorage
   *
   * @param key
   */
  getObject<T>(key: string): T {
    const obj: any = localStorage.getItem(key);
    if (obj) {
      return <T> JSON.parse(obj);
    }

    return null;
  }

  /**
   * Get straight text out of local storage. Don't use this if the data is a JSON Object.
   *
   * @param key
   */
  getText(key: string): string {
    return localStorage.getItem(key);
  }

  /**
   * Puts an object into Local Storage. Handles stringifying the JS Object.
   *
   * @param key
   * @param object
   */
  putObject(key: string, object: any): void {
    localStorage.setItem(key, JSON.stringify(object));
  }

  /**
   * Puts text into Local Storage.
   *
   * @param key
   * @param value
   */
  putText(key: string, value: string): void {
    localStorage.setItem(key, value);
  }

  /**
   * Removes an item from local storage based on the key.
   *
   * @param key
   */
  remove(key: string): void {
    localStorage.removeItem(key);
  }

}
