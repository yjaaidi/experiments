import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Component, NgModule, OnInit } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { SearchResult } from '@demo/api-interfaces';
import {
  from,
  Observable,
  of,

  OperatorFunction,
  pipe,
  Subject
} from 'rxjs';
import {
  catchError,
  concatMap,
  delay,
  map,

  scan,
  shareReplay,
  startWith,
  switchMap,
  takeUntil,
  tap
} from 'rxjs/operators';
import { environment } from '../environments/environment';

@Component({
  selector: 'demo-root',
  template: `
    <img class="logo" width="450" src="/assets/marmicode.png" />

    <div style="text-align:center">
      <div>
        <button mat-button color="accent" (click)="sendKeys()">
          SEND KEYS
        </button>

        <button mat-button color="warn" (click)="stop()">STOP</button>
      </div>

      <div>
        <mat-form-field class="keywords">
          <input
            matInput
            placeholder="Keywords"
            [formControl]="keywordsControl"
          />
        </mat-form-field>
      </div>
    </div>

    <ng-container *ngIf="searchResult$ | async as searchResult">
      <img class="image" *ngIf="image$ | async as image" [src]="image" />
      <code>
        <div *ngFor="let item of searchResult.data">
          <span>{{ item.file }}:{{ item.number }}</span>
          <span>{{ item.content }}</span>
        </div>
      </code>
    </ng-container>
  `,
  styles: [
    `
      .logo {
        position: absolute;
        top: 0;
        right: 0;
        height: 100px;
        width: 100px;
      }

      .keywords {
        width: 70%;
      }

      .image {
        display: block;
        margin: auto;
        height: 350px;
        width: 600px;
      }
    `
  ]
})
export class AppComponent implements OnInit {
  keywordsControl = new FormControl();
  searchResult$ = this.keywordsControl.valueChanges.pipe(
    switchMap(keywords =>
      this._httpClient
        .get<SearchResult>(`${environment.apiBaseUrl}/files`, {
          params: {
            q: keywords
          }
        })
        .pipe(
          map(({ items }) => items.slice(0, 100)),
          progressify(),
          takeUntil(this._stop$)
        )
    ),
    shareReplay({
      bufferSize: 1,
      refCount: true
    })
  );

  image$ = this.searchResult$.pipe(
    map(result => {
      if (result.isLoading) {
        return '/assets/loading.gif';
      }

      if (result.error != null || result.data.length === 0) {
        return '/assets/error.gif';
      }
    })
  );

  private _sendKeys$ = new Subject();
  private _fillSearchInputEffect$: Observable<any>;
  private _stop$ = new Subject();

  constructor(private _httpClient: HttpClient) {
    this._fillSearchInputEffect$ = this._sendKeys$.pipe(
      switchMap(() => {
        return from(
          "A ZoneDelegate is needed because a child zone can't simply invoke a method on a parent zone."
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

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserAnimationsModule,
    BrowserModule,
    HttpClientModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}

export function progressify<T>(): OperatorFunction<T, Progressified<T>> {
  return pipe(
    map(data => ({ data, isLoading: false })),
    startWith({ isLoading: true }),
    catchError(error => of({ isLoading: false, error }))
  );
}

export interface Progressified<T> {
  data?: T;
  error?: unknown;
  isLoading: boolean;
}
