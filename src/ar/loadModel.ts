import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import type { Group } from 'three'
import {
  getCachedModel,
  hasCachedModel,
  setCachedModel,
} from './modelCache'

const loader = new GLTFLoader()

export async function loadModel(path: string): Promise<Group | null> {
  if (hasCachedModel(path)) {
    return getCachedModel(path) as Group
  }

  return new Promise((resolve) => {
    loader.load(
      path,
      (gltf) => {
        const model = gltf.scene
        setCachedModel(path, model)
        resolve(model)
      },
      undefined,
      () => {
        console.warn(`No se pudo cargar el modelo: ${path}`)
        resolve(null)
      },
    )
  })
}
