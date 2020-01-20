import { Component } from '@angular/core';

import { Apollo } from 'apollo-angular';
import gql from 'graphql-tag';
import { concat, from, Observable } from 'rxjs';
import { bufferCount, map, shareReplay } from 'rxjs/operators';

export interface Stat {
  date: Date;
  cpuUsage: number;
  memoryUsage: number;
}

export type Series = Array<{
  name: string;
  value: number;
}>;

@Component({
  selector: 'demo-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  cpuChartData$: Observable<{ series: Series; name: string }[]>;
  memoryChartData$: Observable<{ series: Series; name: string }[]>;

  constructor(private _apollo: Apollo) {
    const stat$: Observable<Stat> = this._apollo
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
        })),
        shareReplay({
          bufferSize: 1,
          refCount: true
        })
      );

    const bufferSize = 100;

    const placeholderStat$ = from(
      Array.from(new Array(bufferSize)).map((_, i) => i)
    ).pipe(map(i => ({ date: i, cpuUsage: 0, memoryUsage: 0 })));

    const statWithInitialData$ = concat(placeholderStat$, stat$);

    stat$.subscribe(console.log);

    this.cpuChartData$ = statWithInitialData$.pipe(
      map(stat => ({
        name: stat.date.toString(),
        value: stat.cpuUsage
      })),
      bufferCount(bufferSize, 1),
      map(series => [{ name: 'CPU', series }])
    );

    this.memoryChartData$ = statWithInitialData$.pipe(
      map(stat => ({
        name: stat.date.toString(),
        value: stat.memoryUsage / 1000
      })),
      bufferCount(bufferSize, 1),
      map(series => [{ name: 'Memory', series }])
    );
  }
}
