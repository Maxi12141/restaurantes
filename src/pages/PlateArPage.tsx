import { useEffect, useRef, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import * as THREE from 'three'
import { X } from 'lucide-react'
import { createDishPlate } from '../ar/createDishPlate'
import {
  orientToQuaternion,
  requestOrientationPermission,
} from '../ar/deviceOrientation'
import { getDish } from '../data/menu'

export function PlateArPage() {
  const { id = '' } = useParams()
  const dish = getDish(id)
  const navigate = useNavigate()

  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!dish) return
    const currentDish = dish

    let stopped = false
    let raf = 0
    let stream: MediaStream | null = null
    let renderer: THREE.WebGLRenderer | null = null
    let plate: THREE.Group | null = null

    const deviceQ = new THREE.Quaternion()
    const offsetQ = new THREE.Quaternion()
    const camQ = new THREE.Quaternion()
    let hasOrient = false
    let placed = false

    const getScreenOrient = () =>
      window.screen?.orientation?.angle ??
      (typeof window.orientation === 'number' ? window.orientation : 0)

    let screenOrient = getScreenOrient()
    const orient = { alpha: 0, beta: 75, gamma: 0 }

    const onOrient = (e: DeviceOrientationEvent) => {
      if (e.alpha == null || e.beta == null || e.gamma == null) return
      orient.alpha = e.alpha
      orient.beta = e.beta
      orient.gamma = e.gamma
      hasOrient = true
    }
    const onScreen = () => {
      screenOrient = getScreenOrient()
    }

    const placeNow = () => {
      if (!plate || placed) return
      orientToQuaternion(
        orient.alpha,
        orient.beta,
        orient.gamma,
        screenOrient,
        deviceQ,
      )
      offsetQ.copy(deviceQ).invert()
      plate.visible = true
      placed = true
    }

    async function start() {
      try {
        // Pedir permisos al entrar (viene del tap en "Ver 3D")
        await requestOrientationPermission()
        window.addEventListener('deviceorientation', onOrient, true)
        window.addEventListener('orientationchange', onScreen)

        const video = videoRef.current
        const canvas = canvasRef.current
        if (!video || !canvas) return

        stream = await navigator.mediaDevices.getUserMedia({
          audio: false,
          video: {
            facingMode: { ideal: 'environment' },
            width: { ideal: 1280 },
            height: { ideal: 720 },
          },
        })
        if (stopped) {
          stream.getTracks().forEach((t) => t.stop())
          return
        }
        video.srcObject = stream
        await video.play()

        const scene = new THREE.Scene()
        const camera = new THREE.PerspectiveCamera(
          60,
          canvas.clientWidth / Math.max(canvas.clientHeight, 1),
          0.01,
          40,
        )
        camera.position.set(0, 1.25, 0.02)

        renderer = new THREE.WebGLRenderer({
          canvas,
          alpha: true,
          antialias: true,
          powerPreference: 'high-performance',
        })
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
        renderer.setSize(canvas.clientWidth, canvas.clientHeight, false)
        renderer.outputColorSpace = THREE.SRGBColorSpace
        renderer.shadowMap.enabled = true
        renderer.shadowMap.type = THREE.PCFSoftShadowMap
        renderer.setClearColor(0x000000, 0)

        const hemi = new THREE.HemisphereLight(0xffffff, 0x444444, 1.15)
        scene.add(hemi)
        const key = new THREE.DirectionalLight(0xfff2e0, 1.4)
        key.position.set(1.2, 3.2, 1.4)
        key.castShadow = true
        key.shadow.mapSize.set(1024, 1024)
        scene.add(key)
        scene.add(new THREE.DirectionalLight(0xb8d0ff, 0.35).translateX(-2))

        try {
          plate = await createDishPlate(currentDish.image, currentDish.plateCm)
        } catch {
          plate = await createDishPlate(
            'https://images.unsplash.com/photo-1632778149955-e80f8ceca2e8?auto=format&fit=crop&w=900&q=80',
            currentDish.plateCm,
          )
        }
        plate.position.set(0, 0, -1.05)
        scene.add(plate)

        // Proyectar de inmediato
        placeNow()
        // Re-anclar cuando llegue la primera orientación real del teléfono
        const waitOrient = window.setInterval(() => {
          if (hasOrient) {
            placed = false
            placeNow()
            window.clearInterval(waitOrient)
          }
        }, 50)
        window.setTimeout(() => window.clearInterval(waitOrient), 2500)

        const resize = () => {
          if (!renderer || !canvas) return
          const w = canvas.clientWidth
          const h = Math.max(canvas.clientHeight, 1)
          camera.aspect = w / h
          camera.updateProjectionMatrix()
          renderer.setSize(w, h, false)
        }
        window.addEventListener('resize', resize)
        resize()

        const tick = () => {
          if (stopped || !renderer) return
          raf = requestAnimationFrame(tick)

          if (hasOrient && placed) {
            orientToQuaternion(
              orient.alpha,
              orient.beta,
              orient.gamma,
              screenOrient,
              deviceQ,
            )
            camQ.copy(offsetQ).multiply(deviceQ)
            camera.position.set(0, 1.25, 0.02)
            camera.quaternion.copy(camQ)
          } else if (placed) {
            const t = performance.now() * 0.0003
            camera.position.set(Math.sin(t) * 0.95, 1.2, Math.cos(t) * 0.95)
            camera.lookAt(plate!.position.x, 0.05, plate!.position.z)
          }

          renderer.render(scene, camera)
        }
        tick()

        return () => {
          window.clearInterval(waitOrient)
          window.removeEventListener('resize', resize)
        }
      } catch (e) {
        console.error(e)
        setError('No se pudo abrir la cámara. Permití el acceso e intentá de nuevo.')
      }
    }

    let extraCleanup: (() => void) | undefined
    void start().then((cleanup) => {
      extraCleanup = cleanup
    })

    return () => {
      stopped = true
      cancelAnimationFrame(raf)
      extraCleanup?.()
      window.removeEventListener('deviceorientation', onOrient, true)
      window.removeEventListener('orientationchange', onScreen)
      stream?.getTracks().forEach((t) => t.stop())
      renderer?.dispose()
    }
  }, [dish])

  if (!dish) {
    return (
      <div className="ar-page empty-state">
        <p>Plato no encontrado.</p>
        <Link to="/menu" className="btn btn-primary">
          Volver al menú
        </Link>
      </div>
    )
  }

  return (
    <div className="ar-page ar-page-world ar-page-direct">
      <video ref={videoRef} className="ar-video" playsInline muted autoPlay />
      <canvas ref={canvasRef} className="ar-canvas" />

      <button
        type="button"
        className="ar-close-only"
        onClick={() => navigate(`/dish/${dish.id}`)}
        aria-label="Cerrar"
      >
        <X size={20} />
      </button>

      {error && (
        <div className="ar-loading">
          <p>{error}</p>
          <button
            type="button"
            className="btn btn-primary"
            onClick={() => navigate(`/dish/${dish.id}`)}
          >
            Volver
          </button>
        </div>
      )}
    </div>
  )
}
