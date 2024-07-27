import RAPIER from "@dimforge/rapier3d-compat";
import { Context } from "../../types/context";
import * as THREE from 'three';

import type { RigidBodyType } from '../../types/rapier'

export class RigidBody {
  context: Context;
  body!: RAPIER.RigidBody;
  collider!: RAPIER.Collider;
  mesh!: any;
  type!: RigidBodyType
  constructor(context: Context) {
    this.context = context;
  }


  getInterface() {
    return this.body;
  }

  create(pos: [number, number, number], type: RigidBodyType) {
    const { world } = this.context.physicsContext
    const { scene } = this.context.threeContext

    const bodyType = type === 'fixed' ? RAPIER.RigidBodyType.Fixed : type === 'kinematicPosition' ? RAPIER.RigidBodyType.KinematicPositionBased : RAPIER.RigidBodyType.Dynamic;

    const rbDesc = new RAPIER.RigidBodyDesc(bodyType);
    rbDesc.setTranslation(...pos).setAngularDamping(2).setLinearDamping(2);

    const body = world.createRigidBody(rbDesc);

    this.body = body;


    const colliderDesc = RAPIER.ColliderDesc.ball(0.1);
    const collider = world.createCollider(colliderDesc, body);
    this.collider = collider

    this.mesh = new THREE.Mesh(
      new THREE.SphereGeometry(0.05, 32, 32),
      new THREE.MeshBasicMaterial({ color: 'red' })
    )
    scene.add(this.mesh)
  }

  update() {
    const { x, y, z } = this.body.translation()
    this.mesh.position.set(x, y, z)
  }

  dispose() {
    const { world } = this.context.physicsContext;
    world.removeRigidBody(this.body);
  }
}