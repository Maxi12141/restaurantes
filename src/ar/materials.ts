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

/** Porcelana neutra clara, clearcoat suave. */
export function createPlateMaterial(
  options: PlateMaterialOptions = {},
): THREE.MeshPhysicalMaterial {
  return new THREE.MeshPhysicalMaterial({
    color: options.color ?? '#f4f5f7',
    map: options.map ?? null,
    roughness: 0.28,
    metalness: 0,
    reflectivity: 0.55,
    clearcoat: 0.65,
    clearcoatRoughness: 0.2,
    envMapIntensity: 0.9,
  })
}

/** Comida: PBR mate natural, sin tintes marrones por defecto. */
export function createFoodMaterial(
  options: FoodMaterialOptions = {},
): THREE.MeshPhysicalMaterial {
  return new THREE.MeshPhysicalMaterial({
    color: options.color ?? '#f2f2f0',
    map: options.map ?? null,
    roughness: 0.72,
    metalness: 0,
    sheen: 0.2,
    sheenRoughness: 0.85,
    sheenColor: new THREE.Color('#f7f7f5'),
  })
}

/** Cristal: transparencia física con transmission. */
export function createGlassMaterial(
  options: GlassMaterialOptions = {},
): THREE.MeshPhysicalMaterial {
  return new THREE.MeshPhysicalMaterial({
    color: options.color ?? '#f5f8fc',
    metalness: 0,
    roughness: 0.08,
    transmission: options.transmission ?? 1,
    thickness: options.thickness ?? 0.35,
    ior: options.ior ?? 1.5,
    transparent: true,
    opacity: 1,
    reflectivity: 0.7,
    clearcoat: 0.8,
    clearcoatRoughness: 0.08,
    side: THREE.DoubleSide,
  })
}
