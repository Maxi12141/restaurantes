import * as THREE from 'three'

export type PlateMaterialOptions = {
  color?: THREE.ColorRepresentation
  map?: THREE.Texture | null
}

export type FoodMaterialOptions = {
  color?: THREE.ColorRepresentation
  map?: THREE.Texture | null
}

export type GlassMaterialOptions = {
  color?: THREE.ColorRepresentation
  transmission?: number
  thickness?: number
  ior?: number
}

/** Porcelana: blanco cálido, clearcoat y reflejos suaves. */
export function createPlateMaterial(
  options: PlateMaterialOptions = {},
): THREE.MeshPhysicalMaterial {
  return new THREE.MeshPhysicalMaterial({
    color: options.color ?? '#f7f2ea',
    map: options.map ?? null,
    roughness: 0.18,
    metalness: 0.02,
    reflectivity: 0.9,
    clearcoat: 1,
    clearcoatRoughness: 0.12,
    envMapIntensity: 1,
  })
}

/** Comida: superficie mate con sheen suave. */
export function createFoodMaterial(
  options: FoodMaterialOptions = {},
): THREE.MeshPhysicalMaterial {
  return new THREE.MeshPhysicalMaterial({
    color: options.color ?? '#ffffff',
    map: options.map ?? null,
    roughness: 0.85,
    metalness: 0,
    sheen: 0.35,
    sheenRoughness: 0.75,
    sheenColor: new THREE.Color('#fff1e0'),
  })
}

/** Cristal: transparencia física con transmission. */
export function createGlassMaterial(
  options: GlassMaterialOptions = {},
): THREE.MeshPhysicalMaterial {
  return new THREE.MeshPhysicalMaterial({
    color: options.color ?? '#e8f4ff',
    metalness: 0,
    roughness: 0.05,
    transmission: options.transmission ?? 1,
    thickness: options.thickness ?? 0.35,
    ior: options.ior ?? 1.5,
    transparent: true,
    opacity: 1,
    reflectivity: 0.9,
    clearcoat: 1,
    clearcoatRoughness: 0.05,
    side: THREE.DoubleSide,
  })
}
