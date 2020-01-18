import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { SearchResult } from '@demo/api-interfaces';
import { BehaviorSubject, from, Observable, of, Subject } from 'rxjs';
import {
  concatMap,
  delay,
  scan,
  startWith,
  switchMap,
  tap
} from 'rxjs/operators';
import { environment } from '../environments/environment';

@Component({
  selector: 'demo-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  keywordsControl = new FormControl();
  searchResult$: Observable<SearchResult>;

  private _sendKeys$ = new Subject();
  private _fillSearchInputEffect$: Observable<any>;

  constructor(private _httpClient: HttpClient) {
    this.searchResult$ = this.keywordsControl.valueChanges.pipe(
      switchMap(keywords =>
        this._httpClient
          .get<SearchResult>(`${environment.apiBaseUrl}/files`, {
            params: {
              q: keywords
            }
          })
          .pipe(startWith(null))
      )
    );

    this._fillSearchInputEffect$ = this._sendKeys$.pipe(
      switchMap(() => {
        return from(
          'Valid extensions are considered to be up to maxSize chars long, counting the dot (defaults to 7)'
        ).pipe(
          startWith(''),
          concatMap(character => of(character).pipe(delay(100))),
          scan((acc, character) => acc + character, '')
        );
      }),
      tap(value => this.keywordsControl.setValue(value))
    );
  }

  ngOnInit() {
    this._fillSearchInputEffect$.subscribe();
  }

  sendKeys() {
    this._sendKeys$.next();
  }
}
