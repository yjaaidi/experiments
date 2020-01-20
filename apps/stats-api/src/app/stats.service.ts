import { Injectable, OnApplicationBootstrap } from '@nestjs/common';
import find from 'find-process';

@Injectable()
export class StatsService implements OnApplicationBootstrap {

  onApplicationBootstrap() {
    find('port', 3333).then(console.log);
  }

  getData(): { message: string } {
    return { message: 'Welcome to stats-api!' };
  }
}
