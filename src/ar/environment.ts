import * as THREE from 'three'

export type RestaurantEnvironmentOptions = {
  /** Tamaño del suelo (metros). */
  floorSize?: number
  /** Tamaño de la superficie de servicio (metros). */
  surfaceSize?: number
  /** Color del suelo. */
  floorColor?: THREE.ColorRepresentation
  /** Color de la superficie para platos. */
  surfaceColor?: THREE.ColorRepresentation
  /** Color del fondo. */
  backdropColor?: THREE.ColorRepresentation
}

/**
 * Entorno neutro cálido para presentar platos y comida.
 * Devuelve un grupo listo para `scene.add(...)`.
 */
export function createRestaurantEnvironment(
  options: RestaurantEnvironmentOptions = {},
): THREE.Group {
  const {
    floorSize = 8,
    surfaceSize = 1.4,
    floorColor = '#3d322a',
    surfaceColor = '#6e5642',
    backdropColor = '#2a2420',
  } = options

  const group = new THREE.Group()
  group.name = 'restaurantEnvironment'

  const floor = new THREE.Mesh(
    new THREE.PlaneGeometry(floorSize, floorSize),
    new THREE.MeshStandardMaterial({
      color: floorColor,
      roughness: 0.92,
      metalness: 0.02,
    }),
  )
  floor.name = 'floor'
  floor.rotation.x = -Math.PI / 2
  floor.receiveShadow = true
  group.add(floor)

  const surface = new THREE.Mesh(
    new THREE.PlaneGeometry(surfaceSize, surfaceSize),
    new THREE.MeshStandardMaterial({
      color: surfaceColor,
      roughness: 0.78,
      metalness: 0.04,
    }),
  )
  surface.name = 'servingSurface'
  surface.rotation.x = -Math.PI / 2
  surface.position.y = 0.002
  surface.receiveShadow = true
  group.add(surface)

  const backdrop = new THREE.Mesh(
    new THREE.PlaneGeometry(floorSize * 1.2, floorSize * 0.55),
    new THREE.MeshStandardMaterial({
      color: backdropColor,
      roughness: 1,
      metalness: 0,
      side: THREE.FrontSide,
    }),
  )
  backdrop.name = 'backdrop'
  backdrop.position.set(0, floorSize * 0.2, -floorSize * 0.45)
  backdrop.receiveShadow = true
  group.add(backdrop)

  return group
}
