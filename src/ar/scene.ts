import * as THREE from 'three'
import { createRestaurantEnvironment } from './environment'
import { createRestaurantLighting } from './lighting'

export type RestaurantSceneOptions = {
  /** Color de fondo cálido/neutro. */
  background?: THREE.ColorRepresentation
  /** Si se pasa, habilita el mapa de sombras del renderer. */
  renderer?: THREE.WebGLRenderer
  /** En AR suele desactivarse para no tapar la cámara con suelos oscuros. */
  includeEnvironment?: boolean
}

/**
 * Escena de restaurante con entorno, iluminación y fondo neutro.
 */
export function createRestaurantScene(
  options: RestaurantSceneOptions = {},
): THREE.Scene {
  const { includeEnvironment = true } = options
  const scene = new THREE.Scene()
  scene.background = new THREE.Color(options.background ?? '#2a2420')

  if (includeEnvironment) {
    scene.add(createRestaurantEnvironment())
  }
  scene.add(createRestaurantLighting())

  if (options.renderer) {
    options.renderer.shadowMap.enabled = true
    options.renderer.shadowMap.type = THREE.PCFSoftShadowMap
  }

  return scene
}
