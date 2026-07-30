import * as THREE from 'three'

type OrientRequestable = {
  requestPermission?: () => Promise<'granted' | 'denied'>
}

const zee = new THREE.Vector3(0, 0, 1)
const euler = new THREE.Euler()
const q0 = new THREE.Quaternion()
const q1 = new THREE.Quaternion(-Math.sqrt(0.5), 0, 0, Math.sqrt(0.5)) // -PI/2 X

/** Pide permiso de orientación (requerido en iOS). */
export async function requestOrientationPermission(): Promise<boolean> {
  const DOE = DeviceOrientationEvent as unknown as OrientRequestable
  if (typeof DOE.requestPermission === 'function') {
    try {
      const state = await DOE.requestPermission()
      return state === 'granted'
    } catch {
      return false
    }
  }
  return true
}

/**
 * Convierte alpha/beta/gamma a quaternion de cámara (mundo fijo al girar el teléfono).
 */
export function orientToQuaternion(
  alpha: number,
  beta: number,
  gamma: number,
  screenOrientation: number,
  out: THREE.Quaternion,
) {
  const deg = Math.PI / 180
  euler.set(beta * deg, alpha * deg, -gamma * deg, 'YXZ')
  out.setFromEuler(euler)
  out.multiply(q1)
  out.multiply(q0.setFromAxisAngle(zee, -screenOrientation * deg))
}
