import * as THREE from 'three'

export type RestaurantLightingOptions = {
  /** Intensidad de la luz ambiental. */
  ambientIntensity?: number
  /** Intensidad del HemisphereLight. */
  hemiIntensity?: number
  /** Intensidad de la luz principal (key). */
  keyIntensity?: number
  /** Intensidad de la luz de relleno. */
  fillIntensity?: number
}

/**
 * Iluminación neutra de restaurante moderno (bajo contraste).
 * Devuelve un grupo listo para `scene.add(...)`.
 */
export function createRestaurantLighting(
  options: RestaurantLightingOptions = {},
): THREE.Group {
  const {
    ambientIntensity = 0.55,
    hemiIntensity = 0.75,
    keyIntensity = 0.95,
    fillIntensity = 0.4,
  } = options

  const group = new THREE.Group()
  group.name = 'restaurantLighting'

  const ambient = new THREE.AmbientLight(0xf4f5f7, ambientIntensity)
  ambient.name = 'ambient'
  group.add(ambient)

  const hemi = new THREE.HemisphereLight(0xffffff, 0xd9dde3, hemiIntensity)
  hemi.name = 'hemi'
  hemi.position.set(0, 2.5, 0)
  group.add(hemi)

  const key = new THREE.DirectionalLight(0xffffff, keyIntensity)
  key.name = 'key'
  key.position.set(2.2, 4.5, 2.4)
  key.castShadow = true
  key.shadow.mapSize.set(1024, 1024)
  key.shadow.camera.near = 0.5
  key.shadow.camera.far = 20
  key.shadow.radius = 3
  key.shadow.bias = -0.0004
  group.add(key)
  group.add(key.target)
  key.target.position.set(0, 0.05, 0)

  const fill = new THREE.PointLight(0xeef1f5, fillIntensity, 14, 2)
  fill.name = 'fill'
  fill.position.set(-2.0, 2.0, -1.4)
  group.add(fill)

  return group
}
