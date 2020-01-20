import { Inject, Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { exec } from 'child_process';
import find from 'find-process';
import { PubSub } from 'graphql-subscriptions';
import { bindNodeCallback, EMPTY, Observable, timer } from 'rxjs';
import { fromPromise } from 'rxjs/internal-compatibility';
import { exhaustMap, filter, map, onErrorResumeNext } from 'rxjs/operators';
import { pubSubServiceName, statAdded } from './pub-sub';
import { Stat } from './stats.resolver';

@Injectable()
export class StatsService implements OnApplicationBootstrap {
  constructor(@Inject(pubSubServiceName) private _pubSub: PubSub) {
  }

  stat$: Observable<Stat> = timer(0, 50).pipe(
    exhaustMap(() => fromPromise(find('port', 27017))),
    map(processList => processList[0] && processList[0].pid),
    filter(pid => pid != null),
    exhaustMap(pid => bindNodeCallback(exec)(`ps -p ${pid} -o '%cpu,rss'`).pipe(onErrorResumeNext(EMPTY))),
    map(([output]: [string, string]) => {
      const statLine = output.split('\n')[1].trim();
      const blocks = statLine.split(/ +/);
      return {
        date: new Date(Date.now()),
        cpuUsage: parseInt(blocks[0], 10),
        memoryUsage: parseInt(blocks[1], 10)
      };
    })
  );

  onApplicationBootstrap() {
    this.stat$
      .subscribe(stat => this._pubSub.publish(statAdded, stat));
  }
}
