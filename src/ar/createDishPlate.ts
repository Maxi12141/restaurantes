import * as THREE from 'three'

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

export async function createDishPlate(
  imageUrl: string,
  plateCm: number,
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

  const plateMat = new THREE.MeshStandardMaterial({
    color: '#f4f1ea',
    roughness: 0.35,
    metalness: 0.05,
  })
  const plateGeo = new THREE.LatheGeometry(makePlateProfile(), 72)
  const plate = new THREE.Mesh(plateGeo, plateMat)
  plate.castShadow = true
  plate.receiveShadow = true
  group.add(plate)

  // Comida con volumen (no sticker plano)
  const foodGeo = new THREE.CylinderGeometry(0.34, 0.36, 0.06, 48, 1, false)
  const foodTop = new THREE.MeshStandardMaterial({
    map: foodTex,
    roughness: 0.75,
    metalness: 0.0,
  })
  const foodSide = new THREE.MeshStandardMaterial({
    color: '#6b4a2b',
    roughness: 0.9,
  })
  const foodBottom = new THREE.MeshStandardMaterial({
    color: '#4a3422',
    roughness: 1,
  })
  const food = new THREE.Mesh(foodGeo, [foodSide, foodTop, foodBottom])
  food.position.y = 0.055
  food.castShadow = true
  food.receiveShadow = true
  group.add(food)

  // Capa superior ligeramente abombada para dar relieve
  const mound = new THREE.Mesh(
    new THREE.SphereGeometry(0.28, 32, 16, 0, Math.PI * 2, 0, Math.PI * 0.35),
    new THREE.MeshStandardMaterial({
      map: foodTex,
      roughness: 0.8,
      transparent: true,
      opacity: 0.92,
    }),
  )
  mound.position.y = 0.07
  mound.scale.set(1, 0.45, 1)
  mound.castShadow = true
  group.add(mound)

  // Sombra de contacto en la mesa
  const shadowCanvas = document.createElement('canvas')
  shadowCanvas.width = 256
  shadowCanvas.height = 256
  const ctx = shadowCanvas.getContext('2d')!
  const grad = ctx.createRadialGradient(128, 128, 20, 128, 128, 128)
  grad.addColorStop(0, 'rgba(0,0,0,0.55)')
  grad.addColorStop(0.55, 'rgba(0,0,0,0.18)')
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

  // Plano de mesa sutil (ayuda a leer el anclaje)
  const table = new THREE.Mesh(
    new THREE.CircleGeometry(0.95, 48),
    new THREE.MeshStandardMaterial({
      color: '#8a6a4a',
      roughness: 0.95,
      transparent: true,
      opacity: 0.18,
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
