import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import type { Group } from 'three'
import {
  getCachedModel,
  hasCachedModel,
  setCachedModel,
} from './modelCache'

const loader = new GLTFLoader()

/** Placeholders ~1 KB; los GLB reales suelen superar este umbral. */
const MIN_GLB_BYTES = 2 * 1024

function isGlbBinary(buffer: ArrayBuffer): boolean {
  if (buffer.byteLength < 12) return false
  const magic = new DataView(buffer).getUint32(0, true)
  return magic === 0x46546c67 // 'glTF'
}

function rejectInvalid(path: string, detail?: unknown): null {
  console.error('Modelo GLB inválido o vacío', path, detail ?? '')
  return null
}

export async function loadModel(path: string): Promise<Group | null> {
  if (hasCachedModel(path)) {
    return getCachedModel(path) as Group
  }

  console.log('Intentando cargar modelo:', path)

  try {
    const response = await fetch(path)
    if (!response.ok) {
      return rejectInvalid(path, `HTTP ${response.status}`)
    }

    const buffer = await response.arrayBuffer()
    if (buffer.byteLength < MIN_GLB_BYTES || !isGlbBinary(buffer)) {
      return rejectInvalid(path, `${buffer.byteLength} bytes`)
    }

    return new Promise((resolve) => {
      loader.parse(
        buffer,
        '',
        (gltf) => {
          console.log('Modelo cargado correctamente:', path)
          const model = gltf.scene
          setCachedModel(path, model)
          resolve(model)
        },
        (error) => {
          resolve(rejectInvalid(path, error))
        },
      )
    })
  } catch (error) {
    return rejectInvalid(path, error)
  }
}
