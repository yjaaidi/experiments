import { Component, ViewChild, ElementRef, OnInit } from '@angular/core';
import { DirectionalLight, DirectionalLightHelper, Mesh, MeshBasicMaterial, BoxGeometry, PerspectiveCamera, Scene, WebGLRenderer } from 'three';

export const randomAngle = () => Math.random() * 360;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'three-benchmark';

  @ViewChild('scene', {static: true})
  sceneEl: ElementRef;

  ngOnInit() {
    const scene = new Scene();
    const camera = new PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );

    const renderer = new WebGLRenderer();
    renderer.setSize( window.innerWidth, window.innerHeight );
    this.sceneEl.nativeElement.appendChild( renderer.domElement );

    const geometry = new BoxGeometry( 1, 1, 1 );
    const material = new MeshBasicMaterial( { color: 0xffffff * Math.random() } );
    const cube = new Mesh( geometry, material );
    scene.add( cube );

    const count = 1000;
    const boxes = Array(count).fill(null).map(() => [1, 1, 1]);
    
    const cubes = boxes.map(box => new Mesh(new BoxGeometry(...box), new MeshBasicMaterial( { color: 0xffffff * Math.random() } )));
    cubes.forEach(_cube => {
      _cube.rotation.x = Math.random() * 360;
      _cube.rotation.y = Math.random() * 360;
      scene.add(_cube);
    });

    camera.position.z = 5;

    const animate = () => {
      requestAnimationFrame( animate );

      cubes.forEach(cube => {
        cube.rotation.x += 0.01;
        cube.rotation.y += 0.01;
      })

      renderer.render( scene, camera );
    };

    animate();


  }

}

