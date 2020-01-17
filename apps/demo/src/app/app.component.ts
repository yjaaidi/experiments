import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Message } from '@demo/api-interfaces';
import { timer } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { environment } from '../environments/environment';

@Component({
  selector: 'demo-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  hello$ = timer(0, 100).pipe(
    switchMap(() => this.http.get<Message>(`${environment.apiBaseUrl}/hello`))
  );
  constructor(private http: HttpClient) {}
}
