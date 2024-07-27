import { Context } from "../types/context";
import * as THREE from 'three';

import { RigidBody } from "./physics/RigidBody";
import { RigidBodyType } from "../types/rapier";

export class Card extends RigidBody {

  constructor(context: Context) {
    super(context)
  }


  getInterface() {
    return this.body;
  }

  create(pos: [number, number, number], type: RigidBodyType) {



    super.create(pos, type);
    const { world } = this.context.physicsContext
    const { scene } = this.context.threeContext

    const geometry = new THREE.PlaneGeometry(0.8 * 2, 1.125 * 2);
    const material = new THREE.MeshBasicMaterial({
      transparent: true,
      opacity: 0.25,
      color: 'white',
      side: THREE.DoubleSide
    })

    this.mesh = new THREE.Mesh(geometry, material);

    scene.add(this.mesh)

  }

}