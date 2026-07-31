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
  // Perfil de plato hondo/cerámico (radio en X, altura en Y)
  const samples = [
    [0.0, 0.02],
    [0.08, 0.018],
    [0.18, 0.016],
    [0.28, 0.02],
    [0.36, 0.035],
    [0.42, 0.055],
    [0.46, 0.07],
    [0.48, 0.078],
    [0.49, 0.07],
    [0.47, 0.05],
    [0.44, 0.03],
    [0.4, 0.012],
    [0.32, 0.004],
    [0.2, 0.0],
    [0.0, 0.0],
  ] as const
  for (const [x, y] of samples) points.push(new THREE.Vector2(x, y))
  return points
}

function prepareGlbMesh(obj: THREE.Object3D) {
  if (!(obj instanceof THREE.Mesh)) return

  console.log('MODELO:', obj.name, obj.material)

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
    material.side = THREE.DoubleSide
    if (material.map) {
      material.map.colorSpace = THREE.SRGBColorSpace
    }
  }
}

export async function createDishPlate(
  imageUrl: string,
  plateCm: number,
  plateType: PlateType,
  foodType: FoodType,
): Promise<THREE.Group> {
  const group = new THREE.Group()
  const scale = plateCm / 28 // 28 cm = radio ~0.5 unidades

  const loader = new THREE.TextureLoader()
  loader.setCrossOrigin('anonymous')
  const foodTex = await new Promise<THREE.Texture>((resolve, reject) => {
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

  // Luz local suave para que el plato no quede negro sobre el video AR.
  const localHemi = new THREE.HemisphereLight(0xffffff, 0xe6e8ec, 0.65)
  localHemi.position.set(0, 1.2, 0)
  group.add(localHemi)
  const localKey = new THREE.DirectionalLight(0xffffff, 0.55)
  localKey.position.set(1.2, 2.4, 1.4)
  group.add(localKey)

  const plateModel = await loadModel(getPlateModelPath(plateType))
  console.log('PLATE MODEL:', plateModel)

  if (plateModel) {
    console.log('USANDO MODELO REAL')
    const plate = plateModel.clone(true)
    plate.traverse(prepareGlbMesh)
    applyModelTransform(plate, getPlateTransform(plateType))
    group.add(plate)
  } else {
    console.log('USANDO FALLBACK')
    const plateMat = createPlateMaterial({ color: '#f5f6f8' })
    const plateGeo = new THREE.LatheGeometry(makePlateProfile(), 72)
    const plate = new THREE.Mesh(plateGeo, plateMat)
    plate.castShadow = true
    plate.receiveShadow = true
    group.add(plate)
  }

  const foodModel = await loadModel(getFoodModelPath(foodType))
  console.log('FOOD MODEL:', foodModel)

  if (foodModel) {
    console.log('USANDO MODELO REAL')
    const food = foodModel.clone(true)
    food.traverse(prepareGlbMesh)
    applyModelTransform(food, getFoodTransform(foodType))
    group.add(food)
  } else {
    console.log('USANDO FALLBACK')
    // Comida con volumen (no sticker plano) — materiales claros neutros
    const foodGeo = new THREE.CylinderGeometry(0.34, 0.36, 0.06, 48, 1, false)
    const foodTop = createFoodMaterial({ map: foodTex })
    const foodSide = createFoodMaterial({ color: '#e8e6e3' })
    const foodBottom = createFoodMaterial({ color: '#dedcd8' })
    const food = new THREE.Mesh(foodGeo, [foodSide, foodTop, foodBottom])
    food.position.y = 0.055
    food.castShadow = true
    food.receiveShadow = true
    group.add(food)

    // Capa superior ligeramente abombada para dar relieve
    const moundMat = createFoodMaterial({ map: foodTex })
    moundMat.transparent = true
    moundMat.opacity = 0.92
    const mound = new THREE.Mesh(
      new THREE.SphereGeometry(0.28, 32, 16, 0, Math.PI * 2, 0, Math.PI * 0.35),
      moundMat,
    )
    mound.position.y = 0.07
    mound.scale.set(1, 0.45, 1)
    mound.castShadow = true
    group.add(mound)
  }

  // Sombra de contacto suave en la mesa
  const shadowCanvas = document.createElement('canvas')
  shadowCanvas.width = 256
  shadowCanvas.height = 256
  const ctx = shadowCanvas.getContext('2d')!
  const grad = ctx.createRadialGradient(128, 128, 20, 128, 128, 128)
  grad.addColorStop(0, 'rgba(0,0,0,0.28)')
  grad.addColorStop(0.55, 'rgba(0,0,0,0.1)')
  grad.addColorStop(1, 'rgba(0,0,0,0)')
  ctx.fillStyle = grad
  ctx.fillRect(0, 0, 256, 256)
  const shadowTex = new THREE.CanvasTexture(shadowCanvas)
  const shadow = new THREE.Mesh(
    new THREE.CircleGeometry(0.62, 48),
    new THREE.MeshBasicMaterial({
      map: shadowTex,
      transparent: true,
      depthWrite: false,
    }),
  )
  shadow.rotation.x = -Math.PI / 2
  shadow.position.y = 0.001
  group.add(shadow)

  // Plano de mesa sutil (neutro, ayuda a leer el anclaje)
  const table = new THREE.Mesh(
    new THREE.CircleGeometry(0.95, 48),
    new THREE.MeshStandardMaterial({
      color: '#d8d6d2',
      roughness: 0.9,
      metalness: 0,
      transparent: true,
      opacity: 0.22,
    }),
  )
  table.rotation.x = -Math.PI / 2
  table.position.y = 0.0
  table.receiveShadow = true
  group.add(table)

  group.scale.setScalar(scale)
  group.userData.plateCm = plateCm
  return group
}
