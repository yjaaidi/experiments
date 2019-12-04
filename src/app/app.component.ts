import { Component, OnInit, NgZone, ChangeDetectorRef } from '@angular/core';
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

  constructor(private _changeDetectorRef: ChangeDetectorRef, private _ngZone: NgZone) {
    this.cubeInfoList$ = this.state$.pipe(pluck('cubeInfoList'));
  }

  ngOnInit() {
    this.setCount(100);

    this._ngZone.runOutsideAngular(() => {
      interval(0, animationFrameScheduler).subscribe(() => {
        this._rotateCubes();
        this._changeDetectorRef.detectChanges();
      });
    })
  }

  setCount(count: number) {
    this._patchState(() => ({
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
    }));
  }

  private _patchState(patcher: (state: State) => Partial<State>) {
    const state = this.state$.value;
    this.state$.next({ ...state, ...patcher(state) });
  }
}
