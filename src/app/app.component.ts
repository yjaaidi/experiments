import { Component, OnInit, NgZone } from '@angular/core';
import {
  BehaviorSubject,
  Observable,
  interval,
  animationFrameScheduler
} from 'rxjs';
import { pluck, tap } from 'rxjs/operators';
import { CubeInfo } from './cube/cube-info';

export interface State {
  cubeInfoList: CubeInfo[];
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  state$ = new BehaviorSubject<State>({
    cubeInfoList: []
  });
  cubeInfoList$: Observable<CubeInfo[]>;

  constructor(private _ngZone: NgZone) {
    this.cubeInfoList$ = this.state$.pipe(pluck('cubeInfoList'));
  }

  ngOnInit() {
    this.setCount(100);

    interval(0, animationFrameScheduler)
      .pipe(tap(() => this._rotateCubes()))
      .subscribe();
    
  }

  setCount(count: number) {
    this._patchState(state => ({
      cubeInfoList: Array(count).fill({
        rotation: {
          x: 0
        }
      })
    }));
  }

  private _rotateCubes() {
    this._patchState(state => ({
      cubeInfoList: state.cubeInfoList.map(cubeInfo => ({
        ...cubeInfo,
        rotation: {
          ...cubeInfo.rotation,
          x: cubeInfo.rotation.x + 0.01
        }
      }))
    }))
  }

  private _patchState(patcher: (state: State) => Partial<State>) {
    const state = this.state$.value;
    this.state$.next({ ...state, ...patcher(state) });
  }

}
