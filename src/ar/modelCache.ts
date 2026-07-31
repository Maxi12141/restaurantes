import type { Object3D } from 'three'

const modelCache = new Map<string, Object3D>()

/** Devuelve el modelo cacheado para `url`, o `undefined` si no existe. */
export function getCachedModel(url: string): Object3D | undefined {
  return modelCache.get(url)
}

/** Guarda un modelo GLB (u otro Object3D) asociado a `url`. */
export function setCachedModel(url: string, model: Object3D): void {
  modelCache.set(url, model)
}

/** Indica si ya hay un modelo en caché para `url`. */
export function hasCachedModel(url: string): boolean {
  return modelCache.has(url)
}

/** Vacía toda la caché de modelos. */
export function clearModelCache(): void {
  modelCache.clear()
}
