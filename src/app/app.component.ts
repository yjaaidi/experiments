import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { animationFrameScheduler, BehaviorSubject, concat, from, interval, Observable, of } from 'rxjs';
import { bufferTime, concatMap, delay, distinctUntilChanged, map, pairwise, pluck, startWith, switchMap } from 'rxjs/operators';
import { CubeInfo } from './cube/cube-info';

/*
 * source: ab (where a=0 & b=350)
 * result: a-b-c-d (where a=0, b=100, c=200, d=300, d=350)
 */
const smoothen = <T extends number>() => (source$: Observable<T>) =>
  source$.pipe(
    distinctUntilChanged(),
    startWith(0),
    pairwise(),
    switchMap(([previous, current]) => {
      const stepCount = Math.floor(Math.abs(current - previous) / 100);
      const stepSize = Math.sign(current - previous) * 100;

      const stepList = Array(stepCount)
        .fill(null)
        .map((_, index) => previous + (index + 1) * stepSize);

      return from([...stepList, current]).pipe(
        concatMap(count => of(count).pipe(delay(10)))
      );
    })
  );

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

  constructor() {
    this.cubeInfoList$ = this.state$.pipe(pluck('cubeInfoList'));
  }

  ngOnInit() {
    const animationFrame$ = interval(0, animationFrameScheduler);

    this.fps$ = animationFrame$.pipe(
      map(() => performance.now()),
      bufferTime(1000, 10),
      map(buffer => {
        const fps = buffer.length;
        return fps;
      })
    );

    animationFrame$.subscribe(() => this._rotateCubes());

    concat(of(this.countControl.value), this.countControl.valueChanges)
      .pipe(smoothen())
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
