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

    // const boxes = Array(count)
    //   .fill(null)
    //   .map(() => [1, 1, 1]);

    // const cubes = boxes.map(
    //   () =>
    //     new Mesh(
    //       new BoxGeometry(1, 1, 1),
    //       new MeshBasicMaterial({ color: 0xffffff * Math.random() })
    //     )
    // );
    // cubes.forEach(cube => {
    //   cube.rotation.x = Math.random() * 360;
    //   cube.rotation.y = Math.random() * 360;
    //   cube.rotation.z = Math.random() * 360;
    //   this._scene.add(cube);
    // });

    // const animate = () => {
    //   requestAnimationFrame(animate);

    //   cubes.forEach(cube => {
    //     cube.rotation.x += 0.01;
    //     // cube.rotation.z += 0.01;
    //   });

    //   this._renderer.render(this._scene, this._camera);
    // };

    // animate();
  }

  ngDoCheck() {
    this._ngZone.runOutsideAngular(() => setTimeout(() => this._threeScene.render()));
  }

}
