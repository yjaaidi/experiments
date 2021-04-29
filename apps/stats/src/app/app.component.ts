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
  template: `
    <div class="mc-cpu-chart">
      <ngx-charts-area-chart
        [animations]="false"
        [yScaleMax]="100"
        [legend]="true"
        [yAxis]="true"
        [results]="cpuChartData$ | async"
      >
      </ngx-charts-area-chart>
    </div>

    <div class="mc-memory-chart">
      <ngx-charts-area-chart
        [animations]="false"
        [scheme]="{ domain: ['#5AA454'] }"
        [legend]="true"
        [yAxis]="true"
        [results]="memoryChartData$ | async"
      >
      </ngx-charts-area-chart>
    </div>
  `,
  styles: [
    `
      :host {
        display: block;
        height: 100vh;
        width: 100%;
      }

      .mc-cpu-chart,
      .mc-memory-chart {
        height: 50%;
      }
    `
  ]
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
