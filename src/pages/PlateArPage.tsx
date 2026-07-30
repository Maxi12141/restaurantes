import { useEffect, useRef, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import * as THREE from 'three'
import { Camera, RotateCcw, Scan, X } from 'lucide-react'
import { createDishPlate } from '../ar/createDishPlate'
import {
  orientToQuaternion,
  requestOrientationPermission,
} from '../ar/deviceOrientation'
import { getDish } from '../data/menu'

type Phase = 'boot' | 'aim' | 'placed' | 'error'

export function PlateArPage() {
  const { id = '' } = useParams()
  const dish = getDish(id)
  const navigate = useNavigate()

  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const wrapRef = useRef<HTMLDivElement>(null)

  const [phase, setPhase] = useState<Phase>('boot')
  const [error, setError] = useState<string | null>(null)
  const [hint, setHint] = useState('Apuntá a una mesa y tocá Colocar plato')

  const engineRef = useRef<{
    stop: () => void
    place: () => void
    reset: () => void
  } | null>(null)

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

    const orient = { alpha: 0, beta: 90, gamma: 0 }

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

    async function start() {
      try {
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
        camera.position.set(0, 1.35, 0.05)

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
        const key = new THREE.DirectionalLight(0xfff2e0, 1.35)
        key.position.set(1.2, 3.2, 1.4)
        key.castShadow = true
        key.shadow.mapSize.set(1024, 1024)
        key.shadow.camera.near = 0.1
        key.shadow.camera.far = 12
        scene.add(key)
        const fill = new THREE.DirectionalLight(0xb8d0ff, 0.35)
        fill.position.set(-2, 1.5, -1)
        scene.add(fill)

        try {
          plate = await createDishPlate(currentDish.image, currentDish.plateCm)
        } catch {
          plate = await createDishPlate(
            'https://images.unsplash.com/photo-1632778149955-e80f8ceca2e8?auto=format&fit=crop&w=900&q=80',
            currentDish.plateCm,
          )
        }
        plate.visible = false
        // Pose inicial: sobre la mesa frente a la cámara
        plate.position.set(0, 0, -1.15)
        plate.rotation.x = 0
        scene.add(plate)

        // Retícula de ayuda antes de colocar
        const reticle = new THREE.Mesh(
          new THREE.RingGeometry(0.12, 0.15, 48),
          new THREE.MeshBasicMaterial({
            color: 0xff6a2b,
            transparent: true,
            opacity: 0.85,
            side: THREE.DoubleSide,
          }),
        )
        reticle.rotation.x = -Math.PI / 2
        reticle.position.set(0, 0.002, -1.15)
        scene.add(reticle)

        window.addEventListener('deviceorientation', onOrient, true)
        window.addEventListener('orientationchange', onScreen)

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

        const place = () => {
          if (!plate) return
          orientToQuaternion(
            orient.alpha,
            orient.beta,
            orient.gamma,
            screenOrient,
            deviceQ,
          )
          // Congela el marco actual: a partir de acá el mundo queda quieto
          offsetQ.copy(deviceQ).invert()
          plate.visible = true
          reticle.visible = false
          placed = true
          setPhase('placed')
          setHint('Mové el celular: el plato se queda en la mesa')
        }

        const reset = () => {
          if (!plate) return
          placed = false
          plate.visible = false
          reticle.visible = true
          offsetQ.identity()
          setPhase('aim')
          setHint('Apuntá a una mesa y tocá Colocar plato')
        }

        engineRef.current = {
          stop: () => undefined,
          place,
          reset,
        }

        setPhase('aim')
        setHint('Apuntá a una mesa y tocá Colocar plato')

        const tick = () => {
          if (stopped || !renderer) return
          raf = requestAnimationFrame(tick)

          if (hasOrient) {
            orientToQuaternion(
              orient.alpha,
              orient.beta,
              orient.gamma,
              screenOrient,
              deviceQ,
            )
            if (placed) {
              camQ.copy(offsetQ).multiply(deviceQ)
              camera.quaternion.copy(camQ)
            } else {
              // Antes de colocar: cámara leve, reticle fija en vista
              camera.quaternion.identity()
              camera.position.set(0, 1.35, 0.05)
              camera.lookAt(0, 0, -1.15)
            }
          } else if (placed) {
            // Desktop fallback: órbita suave para demostrar el anclaje
            const t = performance.now() * 0.00035
            camera.position.set(Math.sin(t) * 1.1, 1.15, Math.cos(t) * 1.1)
            camera.lookAt(plate!.position)
          } else {
            camera.position.set(0, 1.35, 0.05)
            camera.lookAt(0, 0, -1.15)
          }

          if (plate?.visible) {
            // Micro-oscilación de luz, no del plato
            key.position.x = 1.2 + Math.sin(performance.now() * 0.001) * 0.15
          }

          renderer.render(scene, camera)
        }
        tick()

        engineRef.current.stop = () => {
          cancelAnimationFrame(raf)
          window.removeEventListener('deviceorientation', onOrient, true)
          window.removeEventListener('orientationchange', onScreen)
          window.removeEventListener('resize', resize)
          stream?.getTracks().forEach((t) => t.stop())
          renderer?.dispose()
        }
      } catch (e) {
        console.error(e)
        setError(
          'No se pudo iniciar la cámara AR. Permití cámara y orientación, y usá HTTPS en el celular.',
        )
        setPhase('error')
      }
    }

    void start()

    return () => {
      stopped = true
      cancelAnimationFrame(raf)
      engineRef.current?.stop()
      engineRef.current = null
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

  const onPlace = async () => {
    const ok = await requestOrientationPermission()
    if (!ok) {
      setHint('Activá el permiso de movimiento para anclar el plato')
    }
    engineRef.current?.place()
  }

  return (
    <div className="ar-page ar-page-world" ref={wrapRef}>
      <video ref={videoRef} className="ar-video" playsInline muted autoPlay />
      <canvas ref={canvasRef} className="ar-canvas" />

      {phase === 'boot' && (
        <div className="ar-loading">
          <Camera size={28} />
          <p>Preparando visión 3D…</p>
        </div>
      )}

      {phase === 'error' && (
        <div className="ar-loading">
          <p>{error}</p>
          <button type="button" className="btn btn-primary" onClick={() => navigate(-1)}>
            Volver
          </button>
        </div>
      )}

      <header className="ar-top">
        <button
          type="button"
          className="close-btn"
          onClick={() => navigate(`/dish/${dish.id}`)}
          aria-label="Cerrar"
        >
          <X size={20} />
        </button>
        <div className="ar-title">
          <Scan size={16} />
          <div>
            <strong>{dish.name}</strong>
            <span>Plato anclado a la mesa · Ø {dish.plateCm} cm</span>
          </div>
        </div>
      </header>

      <aside className="ar-contents">
        <p>Contiene</p>
        <ul>
          {dish.contents.map((c) => (
            <li key={c}>{c}</li>
          ))}
        </ul>
      </aside>

      {phase === 'aim' && <div className="ar-aim-pulse" aria-hidden />}

      <footer className="ar-controls">
        <p className="ar-hint">{hint}</p>
        <div className="ar-actions">
          {phase !== 'placed' ? (
            <button type="button" className="btn btn-primary btn-block" onClick={onPlace}>
              Colocar plato en la mesa
            </button>
          ) : (
            <>
              <button
                type="button"
                className="btn btn-ghost btn-block"
                onClick={() => engineRef.current?.reset()}
              >
                <RotateCcw size={16} /> Volver a colocar
              </button>
              <p className="ar-hint-mini">
                Girá alrededor: el plato queda quieto y lo ves desde otros ángulos.
              </p>
            </>
          )}
        </div>
      </footer>
    </div>
  )
}
