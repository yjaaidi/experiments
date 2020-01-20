import { Component, OnInit } from '@angular/core';

import { Apollo } from 'apollo-angular';
import gql from 'graphql-tag';
import { Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';

export interface Stat {
  date: Date;
  cpuUsage: number;
  memoryUsage: number;
}

@Component({
  selector: 'demo-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'stats';

  private _stat$: Observable<Stat> = this._apollo
    .subscribe({
      query: gql`
        subscription {
          stat {
            date
            cpuUsage
            memoryUsage
          }
        }
      `
    })
    .pipe(
      map(({ data }: { data: any }) => ({
        date: new Date(data.stat.date),
        ...data.stat
      }))
    );

  private _statsSubscription = gql`
    subscription {
      stat {
        date
        cpuUsage
        memoryUsage
      }
    }
  `;

  constructor(private _apollo: Apollo) {}

  ngOnInit() {
    this._stat$.subscribe(stat => {
      console.log(stat);
    });
  }
}
