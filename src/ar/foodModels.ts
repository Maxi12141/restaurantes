export type FoodType = 'burger' | 'milanesa' | 'pasta' | 'pizza'

const FOOD_MODEL_PATHS: Record<FoodType, string> = {
  burger: '/models/foods/burger.glb',
  milanesa: '/models/foods/milanesa.glb',
  pasta: '/models/foods/pasta.glb',
  pizza: '/models/foods/pizza.glb',
}

/** Ruta pública del GLB correspondiente al tipo de comida. */
export function getFoodModelPath(type: FoodType): string {
  console.log('Food path:', FOOD_MODEL_PATHS[type])
  return FOOD_MODEL_PATHS[type]
}
