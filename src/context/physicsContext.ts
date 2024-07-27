import RAPIER from '@dimforge/rapier3d-compat'


/**
 * initialize rapier world context and initalize its basic settings
 */
export async function createPhysicsContext({
  gravity = [0, -40, 0]
}: {
  gravity?: [number, number, number]
} = {}) {
  await RAPIER.init()

  const world = new RAPIER.World(new RAPIER.Vector3(...gravity));

  return {
    world
  }
}