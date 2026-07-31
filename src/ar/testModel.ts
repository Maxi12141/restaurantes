import type { Group } from 'three'
import { loadModel } from './loadModel'

export function testPlateModel(): Promise<Group | null> {
  return loadModel('/models/plates/white_plate.glb')
}
