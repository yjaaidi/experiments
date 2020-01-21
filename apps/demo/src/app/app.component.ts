import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { SearchResult } from '@demo/api-interfaces';
import { EMPTY, from, Observable, of, Subject } from 'rxjs';
import { concatMap, delay, onErrorResumeNext, scan, startWith, switchMap, takeUntil, tap } from 'rxjs/operators';
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
  private _stop$ = new Subject();

  constructor(private _httpClient: HttpClient) {
    this.searchResult$ = this.keywordsControl.valueChanges.pipe(
      switchMap(keywords =>
        this._httpClient
          .get<SearchResult>(`${environment.apiBaseUrl}/files`, {
            params: {
              q: keywords
            }
          })
          .pipe(
            startWith(null),
            onErrorResumeNext(EMPTY),
            takeUntil(this._stop$)
          )
      )
    );

    this._fillSearchInputEffect$ = this._sendKeys$.pipe(
      switchMap(() => {
        return from(
          'A ZoneDelegate is needed because a child zone can\'t simply invoke a method on a parent zone.'
        ).pipe(
          startWith(''),
          concatMap(character => of(character).pipe(delay(50))),
          scan((acc, character) => acc + character, ''),
          takeUntil(this._stop$)
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

  stop() {
    this._stop$.next();
  }

}
