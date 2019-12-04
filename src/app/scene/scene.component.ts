import { AfterContentInit, Component, ContentChildren, ElementRef, NgZone, QueryList, Injectable } from '@angular/core';
import { map, pairwise, startWith } from 'rxjs/operators';
import { BoxGeometry, Mesh, MeshBasicMaterial, PerspectiveCamera, Scene, WebGLRenderer } from 'three';
import { CubeComponent } from './../cube/cube.component';

function createCamera() {
  const camera = new PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
  camera.position.x = 2;
  camera.position.z = 2;
  camera.rotation.y = .8;
  return camera;
}

function createRenderer() {
  const renderer = new WebGLRenderer();
  renderer.setSize( window.innerWidth, window.innerHeight );
  return renderer;
}

@Injectable({
  providedIn: 'root'
})
export class ThreeScene {

  private _camera = createCamera();
  private _scene = new Scene();
  private _threeRenderer = createRenderer();

  constructor() {
    this._threeRenderer.setSize( window.innerWidth, window.innerHeight );
  }
  
  render() {
    this._threeRenderer.render(this._scene, this._camera);
  }

}

@Component({
  selector: 'app-scene',
  templateUrl: './scene.component.html',
  styleUrls: ['./scene.component.css']
})
export class SceneComponent implements AfterContentInit {

  @ContentChildren(CubeComponent)
  private _cubeCmpList: QueryList<CubeComponent>;
  private _scene = new Scene();
  private _camera = createCamera();
  private _renderer = createRenderer();

  constructor(private elementRef: ElementRef, private ngZone: NgZone, private _threeScene: ThreeScene) { }

  ngAfterContentInit() {

    this._cubeCmpList.changes
      .pipe(startWith(this._cubeCmpList), map(queryList => queryList.toArray()), pairwise())
      .subscribe(([previousList, currentList]) => {
        // console.log(currentList.filter(cube => !previousList.includes(cube)).length);

        // const cube = new Mesh(new BoxGeometry(1, 1, 1), new MeshBasicMaterial( { color: 0xffffff * Math.random() } ));
        // cube.rotation.x = Math.random() * 360;
        // cube.rotation.y = Math.random() * 360;
        // cube.rotation.z = Math.random() * 360;
        
      });

    // this._cubeCmpList.forEach(cubeCmp => console.log(cubeCmp));
  }

  ngOnInit() {
    this.elementRef.nativeElement.appendChild( this._renderer.domElement );

    const count = 300;
    const boxes = Array(count).fill(null).map(() => [1, 1, 1]);
    
    const cubes = boxes.map(box => new Mesh(new BoxGeometry(...box), new MeshBasicMaterial( { color: 0xffffff * Math.random() } )));
    cubes.forEach(cube => {
      cube.rotation.x = Math.random() * 360;
      cube.rotation.y = Math.random() * 360;
      cube.rotation.z = Math.random() * 360;
      this._scene.add(cube);
    });

    const animate = () => {
      requestAnimationFrame( animate );

      cubes.forEach(cube => {
        cube.rotation.x += 0.01;
        // cube.rotation.z += 0.01;
      });

      this._renderer.render( this._scene, this._camera );
    };

    animate();

  }

}
