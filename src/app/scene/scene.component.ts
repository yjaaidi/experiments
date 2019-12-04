import { Component, DoCheck, ElementRef, OnInit, NgZone } from '@angular/core';
import { ThreeScene } from '../three-scene.service';

@Component({
  selector: 'app-scene',
  templateUrl: './scene.component.html',
  styleUrls: ['./scene.component.css'],
  providers: [ThreeScene]
})
export class SceneComponent implements DoCheck, OnInit {
  constructor(
    private _elementRef: ElementRef,
    private _ngZone: NgZone,
    private _threeScene: ThreeScene
  ) {}

  ngOnInit() {
    this._elementRef.nativeElement.appendChild(this._threeScene.getDomElement());
  }

  ngDoCheck() {
    this._ngZone.runOutsideAngular(() => setTimeout(() => this._threeScene.render()));
  }

}
