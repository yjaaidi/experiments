import { Component, OnInit, NgZone, ChangeDetectorRef } from '@angular/core';
import { FormControl } from '@angular/forms';
import {
  BehaviorSubject,
  Observable,
  interval,
  animationFrameScheduler
} from 'rxjs';
import { bufferCount, pluck, startWith, shareReplay, map, pairwise, filter, tap, bufferTime } from 'rxjs/operators';
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
  countControl = new FormControl(100);
  state$ = new BehaviorSubject<State>({
    cubeInfoList: []
  });
  cubeInfoList$: Observable<CubeInfo[]>;
  fps$: Observable<number>;

  constructor(
    private _changeDetectorRef: ChangeDetectorRef,
    private _ngZone: NgZone
  ) {
    this.cubeInfoList$ = this.state$.pipe(pluck('cubeInfoList'));
  }

  ngOnInit() {

    const animationFrame$ = interval(0, animationFrameScheduler).pipe(
      shareReplay({ bufferSize: 1, refCount: true })
    );

    this.fps$ = animationFrame$.pipe(
      map(() => Date.now()),
      bufferTime(1000, 100),
      map((buffer) => {
        const fps = buffer.length / 2;
        return fps;
      }),
    );

    animationFrame$.subscribe(() => {
      this._rotateCubes();
    });

    this.countControl.valueChanges
      .pipe(startWith(this.countControl.value))
      .subscribe(count => this.setCount(count));
  }

  setCount(count: number) {
    this._patchState(() => ({
      cubeInfoList: Array(count)
        .fill(null)
        .map(() => ({
          rotation: {
            x: 360 * Math.random(),
            y: 360 * Math.random()
          }
        }))
    }));
  }

  indexTracker(index) {
    return index;
  }

  private _rotateCubes() {
    this._patchState(state => ({
      cubeInfoList: state.cubeInfoList.map(cubeInfo => ({
        ...cubeInfo,
        rotation: {
          ...cubeInfo.rotation,
          x: cubeInfo.rotation.x + 0.01 * Math.random(),
          y: cubeInfo.rotation.y + 0.01 * Math.random()
        }
      }))
    }));
  }

  private _patchState(patcher: (state: State) => Partial<State>) {
    const state = this.state$.value;
    this.state$.next({ ...state, ...patcher(state) });
  }
}
