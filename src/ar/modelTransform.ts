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
    scale: 1,
    position: { y: 0 },
  },
  black: {
    scale: 1,
    position: { y: 0 },
  },
  ceramic: {
    scale: 1.05,
    position: { y: 0 },
  },
}

const FOOD_TRANSFORMS: Record<FoodType, ModelTransform> = {
  burger: {
    scale: 1,
    position: { y: 0.05 },
  },
  milanesa: {
    scale: 1,
    position: { y: 0.04 },
  },
  pasta: {
    scale: 0.9,
    position: { y: 0.05 },
  },
  pizza: {
    scale: 0.85,
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

/** Aplica escala, posición y rotación a un Object3D con defaults seguros. */
export function applyModelTransform(
  object: THREE.Object3D,
  transform: ModelTransform,
): void {
  const scale = transform.scale ?? 1
  object.scale.setScalar(scale)

  object.position.set(
    transform.position?.x ?? 0,
    transform.position?.y ?? 0,
    transform.position?.z ?? 0,
  )

  object.rotation.set(
    transform.rotation?.x ?? 0,
    transform.rotation?.y ?? 0,
    transform.rotation?.z ?? 0,
  )
}
