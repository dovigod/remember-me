import * as THREE from 'three'
import type { Context, ThreeContext } from '../types/context';
import { MeshLineGeometry, MeshLineMaterial } from 'meshline'



// render state ? 
export class Band {
  context: Context;
  curve: THREE.CatmullRomCurve3;
  composed: any[] = [];
  dragged: boolean = false;
  mesh: THREE.Mesh | null = null;
  joints: any[] = []
  fixed: any;


  constructor(context: Context) {
    this.context = context;
    this.curve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(), new THREE.Vector3(), new THREE.Vector3(), new THREE.Vector3()
    ]);
  }

  create() {
    const { dimension, scene } = this.context.threeContext;

    const material = new MeshLineMaterial({
      opacity: 0.9,
      resolution: new THREE.Vector2(dimension.width, dimension.height),
      lineWidth: 1,
      color: 'white',
    })
    material.depthTest = false;
    material.transparent = true;


    const geometry = new MeshLineGeometry();
    geometry.setPoints(this.curve.getPoints(32))


    this.mesh = new THREE.Mesh(geometry, material);
    scene.add(this.mesh);
  }

  update() {

    for (const mesh of this.composed) {
      mesh.update();
    }

  }

  resize() {
    if (this.mesh) {
      const { dimension } = this.context.threeContext;
      (this.mesh.material as any).resolution = new THREE.Vector2(dimension.width, dimension.height)
    }
  }

  dispose() {
    if (this.mesh) {
      const material = this.mesh.material;
      const geometry = this.mesh.geometry;
      if (material) {
        if (material instanceof Array) {
          material.forEach((mat) => mat.dispose())
        } else {
          (this.mesh.material as THREE.Material).dispose()
        }
      }
      if (geometry) {
        geometry.dispose()
      }
      this.context.threeContext.scene.remove(this.mesh)
    }
  }


  private _setRopePhysics() {

  }
}