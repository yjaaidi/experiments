import { Component, OnInit } from '@angular/core';
import { ThreeScene } from '../three-scene.service';
import { Mesh, BoxGeometry, MeshBasicMaterial } from 'three';

@Component({
  selector: 'app-cube',
  templateUrl: './cube.component.html',
  styleUrls: ['./cube.component.css']
})
export class CubeComponent implements OnInit {
  constructor(private _threeScene: ThreeScene) {}

  ngOnInit() {
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

    const mesh = new Mesh(
      new BoxGeometry(1, 1, 1),
      new MeshBasicMaterial({ color: 0xffffff * Math.random() })
    );

    mesh.rotation.x = Math.random() * 360;
    mesh.rotation.y = Math.random() * 360;
    mesh.rotation.z = Math.random() * 360;

    this._threeScene.add(mesh);
  }
}
