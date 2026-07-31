import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'

export function testGLB(url: string) {
  const loader = new GLTFLoader()

  loader.load(
    url,
    (gltf) => {
      console.log('GLB OK:', url, gltf.scene)
    },
    undefined,
    (error) => {
      console.error('GLB FALLÓ:', url, error)
    },
  )
}
