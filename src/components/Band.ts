import * as THREE from 'three'
import type { Context } from '../types/context';
import { MeshLineGeometry, MeshLineMaterial } from 'meshline'
import { ImpulseJoint } from './physics/ImpulseJoint'
import { RigidBody } from './physics/RigidBody'
import { Card } from './Card';




// render state ? 
export class Band {
  context: Context;
  curve: THREE.CatmullRomCurve3;
  composed: any[] = [];
  dragged: boolean = false;
  mesh: THREE.Mesh | null = null;
  joints: any[] = [];
  bodies: any[] = []
  fixed: any;


  constructor(context: Context) {
    this.context = context;
    this.curve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(), new THREE.Vector3(), new THREE.Vector3(), new THREE.Vector3()
    ]);
  }

  create() {
    const { dimension, scene } = this.context.threeContext;


    //body
    const fixed = new RigidBody(this.context);
    const b1 = new RigidBody(this.context);
    const b2 = new RigidBody(this.context);
    const b3 = new RigidBody(this.context);
    const card = new Card(this.context);

    fixed.create([0, 0, 0], 'fixed');
    b1.create([0.5, 0, 0], 'dynamic');
    b2.create([1, 0, 0], 'dynamic');
    b3.create([1.5, 0, 0], 'dynamic');
    card.create([2, 0, 0], 'dynamic');

    // joints

    const j1 = new ImpulseJoint(this.context);
    const j2 = new ImpulseJoint(this.context);
    const j3 = new ImpulseJoint(this.context);
    const j4 = new ImpulseJoint(this.context);


    j1.create([fixed.body, b1.body, [[0, 0, 0], [0, 0, 0], 1]], 'rope')
    j2.create([b1.body, b2.body, [[0, 0, 0], [0, 0, 0], 1]], 'rope')
    j3.create([b2.body, b3.body, [[0, 0, 0], [0, 0, 0], 1]], 'rope')
    j4.create([b3.body, card.body, [[0, 0, 0], [0, 1.45, 0]]], 'spherical')

    this.bodies.push(...[fixed, b1, b2, b3, card]);
    this.joints.push(...[j1, j2, j3, j4])


    const material = new MeshLineMaterial({
      opacity: 0.9,
      resolution: new THREE.Vector2(dimension.width, dimension.height),
      lineWidth: 1,
      color: 'white',
    })
    material.depthTest = false;
    material.transparent = true;
    material.wireframe = true;


    const geometry = new MeshLineGeometry();
    geometry.setPoints(this.curve.getPoints(32))


    this.mesh = new THREE.Mesh(geometry, material);
    scene.add(this.mesh);


    const h = new THREE.AxesHelper(100);
    scene.add(h)

    this.composed.push(...this.bodies, ...this.joints)
  }

  update() {
    this.curve.points[0].copy(this.bodies[3].body.translation());
    this.curve.points[1].copy(this.bodies[2].body.translation());
    this.curve.points[2].copy(this.bodies[1].body.translation());
    this.curve.points[3].copy(this.bodies[0].body.translation());

    (this.mesh!.geometry as MeshLineGeometry).setPoints(this.curve.getPoints(32));

    for (const composer of this.composed) {
      if ('update' in composer) {
        composer.update();
      }
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

    if (this.composed) {
      for (const item of this.composed) {
        if ('dispose' in item) {
          item.dispose()
        }
      }
    }
  }
}