import { Injectable } from '@angular/core';
import { LocalStorageDef } from '@whiskmate/shared/core';

@Injectable({
  providedIn: 'root',
  useFactory: () => localStorage,
})
export abstract class LocalStorage implements LocalStorageDef {
  abstract setItem(key: string, value: string): void;
  abstract getItem(key: string): string | null;
}
