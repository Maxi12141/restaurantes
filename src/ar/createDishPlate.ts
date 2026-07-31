import * as THREE from 'three'
import type { FoodType } from './foodModels'
import { createFoodMaterial, createPlateMaterial } from './materials'
import type { PlateType } from './plateModels'

function makePlateProfile() {
  const points: THREE.Vector2[] = []
  const samples = [
    [0.0, 0.022],
    [0.1, 0.02],
    [0.22, 0.018],
    [0.32, 0.022],
    [0.4, 0.04],
    [0.45, 0.065],
    [0.48, 0.088],
    [0.5, 0.1],
    [0.498, 0.088],
    [0.48, 0.055],
    [0.45, 0.03],
    [0.38, 0.012],
    [0.25, 0.004],
    [0.1, 0.001],
    [0.0, 0.0],
  ] as const
  for (const [x, y] of samples) points.push(new THREE.Vector2(x, y))
  return points
}

/** Recorta la foto del plato en círculo con borde suave (look menú AR). */
function makeCircularFoodTexture(source: THREE.Texture): THREE.CanvasTexture {
  const img = source.image as HTMLImageElement | ImageBitmap
  const size = 1024
  const canvas = document.createElement('canvas')
  canvas.width = size
  canvas.height = size
  const ctx = canvas.getContext('2d')!

  const iw = 'width' in img ? img.width : size
  const ih = 'height' in img ? img.height : size
  const scale = Math.max(size / iw, size / ih)
  const dw = iw * scale
  const dh = ih * scale
  const dx = (size - dw) / 2
  const dy = (size - dh) / 2

  ctx.save()
  ctx.beginPath()
  ctx.arc(size / 2, size / 2, size / 2 - 2, 0, Math.PI * 2)
  ctx.closePath()
  ctx.clip()
  ctx.drawImage(img as CanvasImageSource, dx, dy, dw, dh)
  ctx.restore()

  // Viñeta suave en el borde para fundirse con el plato
  const feather = ctx.createRadialGradient(
    size / 2,
    size / 2,
    size * 0.42,
    size / 2,
    size / 2,
    size * 0.5,
  )
  feather.addColorStop(0, 'rgba(0,0,0,0)')
  feather.addColorStop(1, 'rgba(0,0,0,0.22)')
  ctx.fillStyle = feather
  ctx.beginPath()
  ctx.arc(size / 2, size / 2, size / 2, 0, Math.PI * 2)
  ctx.fill()

  const tex = new THREE.CanvasTexture(canvas)
  tex.colorSpace = THREE.SRGBColorSpace
  tex.anisotropy = 8
  tex.needsUpdate = true
  return tex
}

function sampleEdgeColor(source: THREE.Texture): string {
  try {
    const img = source.image as HTMLImageElement
    const c = document.createElement('canvas')
    c.width = 8
    c.height = 8
    const ctx = c.getContext('2d')!
    ctx.drawImage(img, 0, 0, 8, 8)
    const d = ctx.getImageData(3, 6, 1, 1).data
    return `rgb(${d[0]},${d[1]},${d[2]})`
  } catch {
    return '#6b5344'
  }
}

/**
 * Plato AR estilo demo: porcelana + foto real del plato en volumen.
 * plateType / foodType se reservan para GLB texturizados futuros.
 */
export async function createDishPlate(
  imageUrl: string,
  plateCm: number,
  plateType: PlateType = 'white',
  _foodType: FoodType = 'burger',
): Promise<THREE.Group> {
  const group = new THREE.Group()
  const scale = plateCm / 28

  const loader = new THREE.TextureLoader()
  loader.setCrossOrigin('anonymous')
  const rawTex = await new Promise<THREE.Texture>((resolve, reject) => {
    loader.load(
      imageUrl,
      (tex) => {
        tex.colorSpace = THREE.SRGBColorSpace
        tex.anisotropy = 8
        resolve(tex)
      },
      undefined,
      reject,
    )
  })

  const foodTex = makeCircularFoodTexture(rawTex)
  const sideColor = sampleEdgeColor(rawTex)

  // Luces locales (sobre video AR, sin suelo oscuro)
  group.add(new THREE.AmbientLight(0xffffff, 0.55))
  const hemi = new THREE.HemisphereLight(0xffffff, 0xd0d4da, 0.85)
  hemi.position.set(0, 1.5, 0)
  group.add(hemi)
  const key = new THREE.DirectionalLight(0xfff8f0, 1.15)
  key.position.set(1.4, 3.2, 1.6)
  key.castShadow = true
  key.shadow.mapSize.set(1024, 1024)
  group.add(key)
  const fill = new THREE.DirectionalLight(0xe8eef8, 0.4)
  fill.position.set(-2, 1.5, -1)
  group.add(fill)

  const plateColors: Record<PlateType, string> = {
    white: '#f7f4ef',
    black: '#2a2a2e',
    ceramic: '#f0e8de',
  }
  const plateMat = createPlateMaterial({ color: plateColors[plateType] })
  const plate = new THREE.Mesh(
    new THREE.LatheGeometry(makePlateProfile(), 96),
    plateMat,
  )
  plate.castShadow = true
  plate.receiveShadow = true
  group.add(plate)

  // Volumen de comida
  const foodH = 0.05
  const foodR = 0.33
  const foodBody = new THREE.Mesh(
    new THREE.CylinderGeometry(foodR * 0.98, foodR, foodH, 64, 1, false),
    [
      createFoodMaterial({ color: sideColor }),
      createFoodMaterial({ map: foodTex }),
      createFoodMaterial({ color: sideColor }),
    ],
  )
  foodBody.position.y = 0.045 + foodH / 2
  foodBody.castShadow = true
  foodBody.receiveShadow = true
  group.add(foodBody)

  // Cara superior: círculo con la foto (lectura limpia como en demos AR)
  const foodTop = new THREE.Mesh(
    new THREE.CircleGeometry(foodR * 0.99, 64),
    new THREE.MeshStandardMaterial({
      map: foodTex,
      roughness: 0.7,
      metalness: 0,
      transparent: true,
    }),
  )
  foodTop.rotation.x = -Math.PI / 2
  foodTop.position.y = 0.045 + foodH + 0.001
  foodTop.castShadow = true
  group.add(foodTop)

  // Relieve suave
  const mound = new THREE.Mesh(
    new THREE.SphereGeometry(foodR * 0.85, 48, 24, 0, Math.PI * 2, 0, Math.PI * 0.32),
    new THREE.MeshStandardMaterial({
      map: foodTex,
      roughness: 0.75,
      transparent: true,
      opacity: 0.88,
    }),
  )
  mound.position.y = 0.05 + foodH
  mound.scale.set(1, 0.4, 1)
  mound.castShadow = true
  group.add(mound)

  // Sombra de contacto
  const shadowCanvas = document.createElement('canvas')
  shadowCanvas.width = 256
  shadowCanvas.height = 256
  const ctx = shadowCanvas.getContext('2d')!
  const grad = ctx.createRadialGradient(128, 128, 18, 128, 128, 128)
  grad.addColorStop(0, 'rgba(0,0,0,0.5)')
  grad.addColorStop(0.5, 'rgba(0,0,0,0.16)')
  grad.addColorStop(1, 'rgba(0,0,0,0)')
  ctx.fillStyle = grad
  ctx.fillRect(0, 0, 256, 256)
  const shadow = new THREE.Mesh(
    new THREE.CircleGeometry(0.65, 64),
    new THREE.MeshBasicMaterial({
      map: new THREE.CanvasTexture(shadowCanvas),
      transparent: true,
      depthWrite: false,
    }),
  )
  shadow.rotation.x = -Math.PI / 2
  shadow.position.y = 0.001
  group.add(shadow)

  group.scale.setScalar(scale)
  group.userData.plateCm = plateCm
  group.userData.plateType = plateType
  return group
}
