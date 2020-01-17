import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormControl } from '@angular/forms';
import { SearchResult } from '@demo/api-interfaces';
import { Observable } from 'rxjs';
import { startWith, switchMap } from 'rxjs/operators';
import { environment } from '../environments/environment';

@Component({
  selector: 'demo-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  keywordsControl = new FormControl();
  searchResult$: Observable<SearchResult>;

  constructor(private _httpClient: HttpClient) {
    this.searchResult$ = this.keywordsControl.valueChanges.pipe(
      switchMap(() =>
        this._httpClient.get<SearchResult>(`${environment.apiBaseUrl}/hello`)
          .pipe(startWith(null))
      )
    );
  }
}
