import RAPIER from '@dimforge/rapier3d-compat'



export async function createPhysicsContext({
  gravity = [0, -40, 0]
}: {
  gravity?: [number, number, number]
} = {}) {
  await RAPIER.init()

  return new RAPIER.World(new RAPIER.Vector3(...gravity))
}

