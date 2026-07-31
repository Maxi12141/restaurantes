/**
 * Genera GLB reales (geometría + PBR) para public/models.
 * Estilo restaurante low/mid poly — listos para reemplazar por assets profesionales.
 */
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import * as THREE from 'three'
import { GLTFExporter } from 'three/examples/jsm/exporters/GLTFExporter.js'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const root = path.resolve(__dirname, '..')

// Polyfill mínimo para GLTFExporter en Node (usa onloadend)
globalThis.FileReader = class FileReader {
  result = null
  onload = null
  onloadend = null
  onerror = null
  readAsArrayBuffer(blob) {
    Promise.resolve(blob.arrayBuffer())
      .then((buf) => {
        this.result = buf
        const ev = { target: this }
        this.onload?.(ev)
        this.onloadend?.(ev)
      })
      .catch((err) => this.onerror?.(err))
  }
}

function makePlateProfile() {
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
  ]
  return samples.map(([x, y]) => new THREE.Vector2(x, y))
}

function createPlate(color, roughness = 0.25, clearcoat = 0.7) {
  const group = new THREE.Group()
  group.name = 'plate'
  const mat = new THREE.MeshPhysicalMaterial({
    color,
    roughness,
    metalness: 0,
    clearcoat,
    clearcoatRoughness: 0.18,
  })
  const mesh = new THREE.Mesh(new THREE.LatheGeometry(makePlateProfile(), 64), mat)
  mesh.name = 'plateMesh'
  mesh.castShadow = true
  mesh.receiveShadow = true
  group.add(mesh)
  return group
}

function createBurger() {
  const group = new THREE.Group()
  group.name = 'burger'
  const bunTop = new THREE.Mesh(
    new THREE.SphereGeometry(0.22, 32, 16, 0, Math.PI * 2, 0, Math.PI * 0.5),
    new THREE.MeshStandardMaterial({ color: '#d4a15a', roughness: 0.75 }),
  )
  bunTop.position.y = 0.12
  bunTop.scale.y = 0.7
  bunTop.name = 'bunTop'

  const patty = new THREE.Mesh(
    new THREE.CylinderGeometry(0.2, 0.2, 0.04, 32),
    new THREE.MeshStandardMaterial({ color: '#5a3420', roughness: 0.9 }),
  )
  patty.position.y = 0.07
  patty.name = 'patty'

  const cheese = new THREE.Mesh(
    new THREE.BoxGeometry(0.36, 0.015, 0.36),
    new THREE.MeshStandardMaterial({ color: '#f0c040', roughness: 0.55 }),
  )
  cheese.position.y = 0.095
  cheese.name = 'cheese'

  const bunBottom = new THREE.Mesh(
    new THREE.CylinderGeometry(0.21, 0.22, 0.05, 32),
    new THREE.MeshStandardMaterial({ color: '#c8944a', roughness: 0.8 }),
  )
  bunBottom.position.y = 0.03
  bunBottom.name = 'bunBottom'

  for (const m of [bunTop, patty, cheese, bunBottom]) {
    m.castShadow = true
    m.receiveShadow = true
    group.add(m)
  }
  return group
}

function createMilanesa() {
  const group = new THREE.Group()
  group.name = 'milanesa'
  const cutlet = new THREE.Mesh(
    new THREE.BoxGeometry(0.42, 0.035, 0.3),
    new THREE.MeshStandardMaterial({ color: '#c9a15b', roughness: 0.85 }),
  )
  cutlet.position.y = 0.03
  cutlet.name = 'cutlet'
  // Bordes redondeados visuales con un disco
  const crust = new THREE.Mesh(
    new THREE.CylinderGeometry(0.2, 0.22, 0.02, 24),
    new THREE.MeshStandardMaterial({ color: '#b8893f', roughness: 0.9 }),
  )
  crust.position.set(0.05, 0.04, 0)
  crust.rotation.z = 0.1
  crust.scale.set(1.1, 1, 0.75)
  crust.name = 'crust'
  for (const m of [cutlet, crust]) {
    m.castShadow = true
    m.receiveShadow = true
    group.add(m)
  }
  return group
}

function createPasta() {
  const group = new THREE.Group()
  group.name = 'pasta'
  const mound = new THREE.Mesh(
    new THREE.SphereGeometry(0.24, 28, 18, 0, Math.PI * 2, 0, Math.PI * 0.55),
    new THREE.MeshStandardMaterial({ color: '#f2e6b8', roughness: 0.7 }),
  )
  mound.position.y = 0.02
  mound.scale.set(1, 0.65, 1)
  mound.name = 'pastaMound'
  const sauce = new THREE.Mesh(
    new THREE.SphereGeometry(0.16, 20, 12, 0, Math.PI * 2, 0, Math.PI * 0.45),
    new THREE.MeshStandardMaterial({ color: '#b8422a', roughness: 0.55 }),
  )
  sauce.position.y = 0.08
  sauce.scale.set(1, 0.4, 1)
  sauce.name = 'sauce'
  for (const m of [mound, sauce]) {
    m.castShadow = true
    m.receiveShadow = true
    group.add(m)
  }
  return group
}

function createPizza() {
  const group = new THREE.Group()
  group.name = 'pizza'
  const base = new THREE.Mesh(
    new THREE.CylinderGeometry(0.28, 0.28, 0.025, 48),
    new THREE.MeshStandardMaterial({ color: '#d8a85a', roughness: 0.8 }),
  )
  base.position.y = 0.02
  base.name = 'crust'
  const sauce = new THREE.Mesh(
    new THREE.CylinderGeometry(0.25, 0.25, 0.012, 48),
    new THREE.MeshStandardMaterial({ color: '#c23b2a', roughness: 0.65 }),
  )
  sauce.position.y = 0.035
  sauce.name = 'sauce'
  const cheese = new THREE.Mesh(
    new THREE.CylinderGeometry(0.24, 0.24, 0.01, 48),
    new THREE.MeshStandardMaterial({ color: '#f3d98a', roughness: 0.5 }),
  )
  cheese.position.y = 0.045
  cheese.name = 'cheese'
  for (const m of [base, sauce, cheese]) {
    m.castShadow = true
    m.receiveShadow = true
    group.add(m)
  }
  // Toppings
  for (let i = 0; i < 8; i++) {
    const a = (i / 8) * Math.PI * 2
    const pepperoni = new THREE.Mesh(
      new THREE.CylinderGeometry(0.035, 0.035, 0.008, 16),
      new THREE.MeshStandardMaterial({ color: '#9a2a22', roughness: 0.7 }),
    )
    pepperoni.position.set(Math.cos(a) * 0.12, 0.052, Math.sin(a) * 0.12)
    pepperoni.castShadow = true
    group.add(pepperoni)
  }
  return group
}

async function exportGlb(object, outPath) {
  const exporter = new GLTFExporter()
  const buffer = await new Promise((resolve, reject) => {
    exporter.parse(object, resolve, reject, {
      binary: true,
      onlyVisible: true,
    })
  })
  fs.mkdirSync(path.dirname(outPath), { recursive: true })
  fs.writeFileSync(outPath, Buffer.from(buffer))
  console.log('Wrote', outPath, Buffer.from(buffer).byteLength, 'bytes')
}

const plates = {
  'white_plate.glb': createPlate('#f5f6f8', 0.22, 0.85),
  'black_plate.glb': createPlate('#2a2a2e', 0.35, 0.55),
  'ceramic_plate.glb': createPlate('#efe8df', 0.3, 0.75),
}

const foods = {
  'burger.glb': createBurger(),
  'milanesa.glb': createMilanesa(),
  'pasta.glb': createPasta(),
  'pizza.glb': createPizza(),
}

async function main() {
  for (const [name, obj] of Object.entries(plates)) {
    await exportGlb(obj, path.join(root, 'public/models/plates', name))
  }
  for (const [name, obj] of Object.entries(foods)) {
    await exportGlb(obj, path.join(root, 'public/models/foods', name))
  }
  console.log('Done.')
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
