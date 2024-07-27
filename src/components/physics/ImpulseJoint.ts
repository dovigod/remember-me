import RAPIER from "@dimforge/rapier3d-compat";
import { Context } from "../../types/context";
import { RopeJointParams, ShpericalJoinParams } from "../../types/rapier";

export class ImpulseJoint {
  context: Context;
  joint!: RAPIER.ImpulseJoint

  constructor(context: Context) {
    this.context = context;
  }

  create(jointParams: ShpericalJoinParams | RopeJointParams, jointType: 'rope' | 'spherical') {

    switch (jointType) {
      case 'rope': {
        this._createRopeJoint(jointParams as RopeJointParams);
        break;
      }
      case 'spherical': {
        this._createShpericalJoint(jointParams as ShpericalJoinParams)
      }
    }
  }


  private _createRopeJoint(params: RopeJointParams) {
    const { world } = this.context.physicsContext

    const [body1, body2, [anchor1, anchor2, length]] = params;
    const vBody1Anchor = new RAPIER.Vector3(...anchor1);
    const vBody2Anchor = new RAPIER.Vector3(...anchor2);

    const jointData = RAPIER.JointData.rope(length, vBody1Anchor, vBody2Anchor);

    const joint = world.createImpulseJoint(
      jointData,
      body1,
      body2,
      true
    );

    this.joint = joint;
  }

  private _createShpericalJoint(params: ShpericalJoinParams) {
    const { world } = this.context.physicsContext
    const [body1, body2, [anchor1, anchor2]] = params;
    const vBody1Anchor = new RAPIER.Vector3(...anchor1);
    const vBody2Anchor = new RAPIER.Vector3(...anchor2);

    const jointData = RAPIER.JointData.spherical(vBody1Anchor, vBody2Anchor);

    const joint = world.createImpulseJoint(
      jointData,
      body1,
      body2,
      true
    );

    this.joint = joint;
  }

  dispose() {
    const { world } = this.context.physicsContext;
    world.removeImpulseJoint(this.joint, true);
  }
}
