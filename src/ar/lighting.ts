import * as THREE from 'three'

export type RestaurantLightingOptions = {
  /** Intensidad de la luz ambiental. */
  ambientIntensity?: number
  /** Intensidad de la luz principal (key). */
  keyIntensity?: number
  /** Intensidad de la luz de relleno. */
  fillIntensity?: number
}

/**
 * Iluminación de estudio cálida para platos y comida.
 * Devuelve un grupo listo para `scene.add(...)`.
 */
export function createRestaurantLighting(
  options: RestaurantLightingOptions = {},
): THREE.Group {
  const {
    ambientIntensity = 0.45,
    keyIntensity = 1.25,
    fillIntensity = 0.55,
  } = options

  const group = new THREE.Group()
  group.name = 'restaurantLighting'

  const ambient = new THREE.AmbientLight(0xfff6ee, ambientIntensity)
  ambient.name = 'ambient'
  group.add(ambient)

  const key = new THREE.DirectionalLight(0xfff2e0, keyIntensity)
  key.name = 'key'
  key.position.set(2.4, 4.2, 2.8)
  key.castShadow = true
  key.shadow.mapSize.set(1024, 1024)
  key.shadow.camera.near = 0.5
  key.shadow.camera.far = 20
  key.shadow.bias = -0.0005
  group.add(key)
  group.add(key.target)
  key.target.position.set(0, 0.05, 0)

  const fill = new THREE.PointLight(0xffe8d4, fillIntensity, 12, 2)
  fill.name = 'fill'
  fill.position.set(-2.2, 1.8, -1.6)
  group.add(fill)

  return group
}
