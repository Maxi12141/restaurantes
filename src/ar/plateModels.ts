export type PlateType = 'white' | 'black' | 'ceramic'

const PLATE_MODEL_PATHS: Record<PlateType, string> = {
  white: '/models/plates/white_plate.glb',
  black: '/models/plates/black_plate.glb',
  ceramic: '/models/plates/ceramic_plate.glb',
}

/** Ruta pública del GLB correspondiente al tipo de plato. */
export function getPlateModelPath(type: PlateType): string {
  console.log('Plate path:', PLATE_MODEL_PATHS[type])
  return PLATE_MODEL_PATHS[type]
}
