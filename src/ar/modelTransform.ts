import * as THREE from 'three'

export type ModelTransform = {
  scale?: number
  position?: {
    x?: number
    y?: number
    z?: number
  }
  rotation?: {
    x?: number
    y?: number
    z?: number
  }
}

export type PlateType = 'white' | 'black' | 'ceramic'

export type FoodType = 'burger' | 'milanesa' | 'pasta' | 'pizza'

const PLATE_TRANSFORMS: Record<PlateType, ModelTransform> = {
  white: {
    scale: 0.55,
  },
  black: {
    scale: 0.55,
  },
  ceramic: {
    scale: 0.6,
  },
}

const FOOD_TRANSFORMS: Record<FoodType, ModelTransform> = {
  burger: {
    scale: 0.45,
    position: { y: 0.08 },
  },
  milanesa: {
    scale: 0.55,
    position: { y: 0.06 },
  },
  pasta: {
    scale: 0.45,
    position: { y: 0.07 },
  },
  pizza: {
    scale: 0.4,
    position: { y: 0.05 },
  },
}

/** Transformación configurada para un tipo de plato. */
export function getPlateTransform(type: PlateType): ModelTransform {
  return PLATE_TRANSFORMS[type]
}

/** Transformación configurada para un tipo de comida. */
export function getFoodTransform(type: FoodType): ModelTransform {
  return FOOD_TRANSFORMS[type]
}

/** Aplica escala, posición (aditiva) y rotación a un Object3D. */
export function applyModelTransform(
  object: THREE.Object3D,
  transform: ModelTransform,
): void {
  const scale = transform.scale ?? 1
  object.scale.setScalar(scale)

  object.position.x += transform.position?.x ?? 0
  object.position.y += transform.position?.y ?? 0
  object.position.z += transform.position?.z ?? 0

  object.rotation.set(
    transform.rotation?.x ?? 0,
    transform.rotation?.y ?? 0,
    transform.rotation?.z ?? 0,
  )
}
