import { Component, OnInit, Injectable } from '@angular/core';
import { map, takeUntil } from 'rxjs/operators';
import { interval, Subject, BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class Terminal {

  messageList$ = new BehaviorSubject([]);

  log(message) {
    const messageList = [...this.messageList$.value, message];
    this.messageList$.next(messageList.slice(Math.max(0, messageList.length - 20)));
  }

}

function AutoUnsubscribe() {
  return (target, key) => {

    if (!target._isAutoUnsubscribeSetup) {

      Object.defineProperty(target, '_onDestroy$', {
        get: function () {
          return this['__onDestroy$'] = this['__onDestroy$'] || new Subject();
        }
      });

      const onDestroy = target.constructor.ngComponentDef.onDestroy;
      target.constructor.ngComponentDef.onDestroy = function () {
        this._onDestroy$.next();
        this._onDestroy$.complete();
        return onDestroy && onDestroy();
      }

      target._isAutoUnsubscribeSetup = true;

    }

    Object.defineProperty(target, key, {
      get: function () {
        return this[`_${key}`];
      },
      set: function (value) {
        if (value != null) {
          value = value.pipe(takeUntil(this._onDestroy$));
        }
        this[`_${key}`] = value;
      }
    });

  };
}


@Component({
  selector: 'wt-child',
  templateUrl: './child.component.html',
  styleUrls: ['./child.component.css']
})
export class ChildComponent implements OnInit {

  @AutoUnsubscribe()
  dataA$ = interval(100).pipe(map(v => `A: ${v}`));
  
  @AutoUnsubscribe()
  dataB$ = interval(100).pipe(map(v => `B: ${v}`));

  constructor(private _terminal: Terminal) { }

  ngOnInit() {
    this.dataA$.subscribe(message => this._terminal.log(message));
    this.dataB$.subscribe(message => this._terminal.log(message));
  }

}
