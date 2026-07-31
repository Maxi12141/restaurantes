import * as THREE from 'three'
import { getFoodModelPath, type FoodType } from './foodModels'
import { loadModel } from './loadModel'
import { createFoodMaterial, createPlateMaterial } from './materials'
import {
  applyModelTransform,
  getFoodTransform,
  getPlateTransform,
} from './modelTransform'
import { getPlateModelPath, type PlateType } from './plateModels'

function makePlateProfile() {
  const points: THREE.Vector2[] = []
  // Plato hondo tipo porcelana de restaurante
  const samples = [
    [0.0, 0.028],
    [0.1, 0.026],
    [0.2, 0.024],
    [0.3, 0.028],
    [0.38, 0.045],
    [0.44, 0.07],
    [0.475, 0.095],
    [0.5, 0.11],
    [0.505, 0.1],
    [0.49, 0.07],
    [0.46, 0.04],
    [0.4, 0.016],
    [0.28, 0.006],
    [0.12, 0.002],
    [0.0, 0.0],
  ] as const
  for (const [x, y] of samples) points.push(new THREE.Vector2(x, y))
  return points
}

function glbHasTextures(root: THREE.Object3D): boolean {
  let hasMap = false
  root.traverse((obj) => {
    if (!(obj instanceof THREE.Mesh)) return
    const mats = Array.isArray(obj.material) ? obj.material : [obj.material]
    for (const mat of mats) {
      if (
        mat &&
        'map' in mat &&
        (mat as THREE.MeshStandardMaterial).map
      ) {
        hasMap = true
      }
    }
  })
  return hasMap
}

function prepareGlbMesh(obj: THREE.Object3D) {
  if (!(obj instanceof THREE.Mesh)) return

  obj.castShadow = true
  obj.receiveShadow = true

  const materials = Array.isArray(obj.material) ? obj.material : [obj.material]
  for (const material of materials) {
    if (
      !(material instanceof THREE.MeshStandardMaterial) &&
      !(material instanceof THREE.MeshPhysicalMaterial)
    ) {
      continue
    }

    material.needsUpdate = true
    if (material.map) {
      material.map.colorSpace = THREE.SRGBColorSpace
      material.map.anisotropy = 8
    }
  }
}

/** Comida volumétrica con la foto real del plato (look de menú AR profesional). */
function createPhotoFood(
  foodTex: THREE.Texture,
  foodType: FoodType,
): THREE.Group {
  const food = new THREE.Group()
  food.name = 'photoFood'

  const radius =
    foodType === 'pizza' ? 0.38 : foodType === 'pasta' ? 0.32 : 0.34
  const height =
    foodType === 'burger' ? 0.1 : foodType === 'pasta' ? 0.085 : 0.055
  const bulge =
    foodType === 'burger' ? 0.55 : foodType === 'pasta' ? 0.5 : 0.38

  const sideMat = createFoodMaterial({ color: '#e9e4dc' })
  const topMat = createFoodMaterial({ map: foodTex })
  topMat.roughness = 0.62
  const bottomMat = createFoodMaterial({ color: '#ddd6cc' })

  const body = new THREE.Mesh(
    new THREE.CylinderGeometry(radius * 0.96, radius, height, 64, 1, false),
    [sideMat, topMat, bottomMat],
  )
  body.position.y = 0.035 + height * 0.5
  body.castShadow = true
  body.receiveShadow = true
  food.add(body)

  const domeMat = createFoodMaterial({ map: foodTex })
  domeMat.roughness = 0.68
  const dome = new THREE.Mesh(
    new THREE.SphereGeometry(
      radius * 0.88,
      48,
      24,
      0,
      Math.PI * 2,
      0,
      Math.PI * bulge,
    ),
    domeMat,
  )
  dome.position.y = 0.03 + height * 0.55
  dome.scale.set(1, foodType === 'burger' ? 0.55 : 0.42, 1)
  dome.castShadow = true
  food.add(dome)

  // Aro de borde suave para integrar foto y plato
  const rim = new THREE.Mesh(
    new THREE.TorusGeometry(radius * 0.97, 0.012, 12, 64),
    new THREE.MeshStandardMaterial({
      color: '#d8d0c6',
      roughness: 0.85,
      metalness: 0,
    }),
  )
  rim.rotation.x = Math.PI / 2
  rim.position.y = 0.035 + height
  rim.castShadow = true
  food.add(rim)

  return food
}

function createPorcelainPlate(plateType: PlateType): THREE.Mesh {
  const colors: Record<PlateType, string> = {
    white: '#f7f8fa',
    black: '#2c2c30',
    ceramic: '#f3ebe3',
  }
  const mat = createPlateMaterial({ color: colors[plateType] })
  if (plateType === 'black') {
    mat.roughness = 0.35
    mat.clearcoat = 0.45
  }
  const plate = new THREE.Mesh(
    new THREE.LatheGeometry(makePlateProfile(), 96),
    mat,
  )
  plate.name = 'porcelainPlate'
  plate.castShadow = true
  plate.receiveShadow = true
  return plate
}

export async function createDishPlate(
  imageUrl: string,
  plateCm: number,
  plateType: PlateType,
  foodType: FoodType,
): Promise<THREE.Group> {
  const group = new THREE.Group()
  const scale = plateCm / 28

  const loader = new THREE.TextureLoader()
  loader.setCrossOrigin('anonymous')
  const foodTex = await new Promise<THREE.Texture>((resolve, reject) => {
    loader.load(
      imageUrl,
      (tex) => {
        tex.colorSpace = THREE.SRGBColorSpace
        tex.anisotropy = 8
        tex.wrapS = THREE.ClampToEdgeWrapping
        tex.wrapT = THREE.ClampToEdgeWrapping
        resolve(tex)
      },
      undefined,
      reject,
    )
  })

  const localHemi = new THREE.HemisphereLight(0xffffff, 0xe8eaee, 0.9)
  localHemi.position.set(0, 1.4, 0)
  group.add(localHemi)
  const localKey = new THREE.DirectionalLight(0xffffff, 0.85)
  localKey.position.set(1.4, 2.8, 1.6)
  localKey.castShadow = true
  group.add(localKey)
  const localFill = new THREE.DirectionalLight(0xf2f4f8, 0.35)
  localFill.position.set(-1.6, 1.8, -1.2)
  group.add(localFill)

  const plateModel = await loadModel(getPlateModelPath(plateType))
  if (plateModel && glbHasTextures(plateModel)) {
    console.log('USANDO MODELO REAL')
    const plate = plateModel.clone(true)
    plate.traverse(prepareGlbMesh)
    applyModelTransform(plate, getPlateTransform(plateType))
    group.add(plate)
  } else {
    // Plato porcelana procedural (mejor que GLB low-poly sin textura)
    console.log('USANDO FALLBACK')
    const plate = createPorcelainPlate(plateType)
    group.add(plate)
  }

  const foodModel = await loadModel(getFoodModelPath(foodType))
  // Solo usamos GLB de comida si trae texturas PBR reales; si no, foto 3D del plato.
  if (foodModel && glbHasTextures(foodModel)) {
    console.log('USANDO MODELO REAL')
    const food = foodModel.clone(true)
    food.traverse(prepareGlbMesh)
    applyModelTransform(food, getFoodTransform(foodType))
    group.add(food)
  } else {
    console.log('USANDO FALLBACK')
    const food = createPhotoFood(foodTex, foodType)
    group.add(food)
  }

  const shadowCanvas = document.createElement('canvas')
  shadowCanvas.width = 256
  shadowCanvas.height = 256
  const ctx = shadowCanvas.getContext('2d')!
  const grad = ctx.createRadialGradient(128, 128, 16, 128, 128, 120)
  grad.addColorStop(0, 'rgba(20,16,12,0.35)')
  grad.addColorStop(0.45, 'rgba(20,16,12,0.12)')
  grad.addColorStop(1, 'rgba(20,16,12,0)')
  ctx.fillStyle = grad
  ctx.fillRect(0, 0, 256, 256)
  const shadow = new THREE.Mesh(
    new THREE.CircleGeometry(0.7, 64),
    new THREE.MeshBasicMaterial({
      map: new THREE.CanvasTexture(shadowCanvas),
      transparent: true,
      depthWrite: false,
      opacity: 0.9,
    }),
  )
  shadow.rotation.x = -Math.PI / 2
  shadow.position.y = 0.001
  group.add(shadow)

  group.scale.setScalar(scale)
  group.userData.plateCm = plateCm
  return group
}
