/**
 * wrapper type & interfaces for dimforge/rapier3d-compat
 */
import type RAPIER from "@dimforge/rapier3d-compat";

type Vector3Like = [number, number, number];

export type RigidBodyType = 'fixed' | 'dynamic' | 'kinematicPosition';

export type ShpericalJoinParams = [RAPIER.RigidBody, RAPIER.RigidBody, [Vector3Like, Vector3Like]]


export type RopeJointParams = [RAPIER.RigidBody, RAPIER.RigidBody, [Vector3Like, Vector3Like, number]]
