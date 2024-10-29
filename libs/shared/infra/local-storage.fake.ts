import { Injectable } from '@angular/core';
import { LocalStorage } from './local-storage.service';
import { LocalStorageDef } from '@whiskmate/shared/core';

@Injectable({
  providedIn: 'root',
})
export class LocalStorageFake implements LocalStorageDef {
  private _map = new Map<string, string>();

  setItem(key: string, value: string) {
    this._map.set(key, value);
  }

  getItem(key: string) {
    return this._map.get(key) ?? null;
  }
}

export function provideLocalStorageFake() {
  return [
    {
      provide: LocalStorage,
      useClass: LocalStorageFake,
    },
  ];
}
