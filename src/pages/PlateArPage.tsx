import { useEffect, useMemo, useRef, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { Camera, Minus, Plus, RotateCcw, Scan, X } from 'lucide-react'
import { getDish } from '../data/menu'
import { SafeImage } from '../components/SafeImage'

/** ~96 CSS px ≈ 2.54 cm on many phones at arm's length reference; scale is user-adjustable */
const BASE_PX_PER_CM = 10.5

export function PlateArPage() {
  const { id = '' } = useParams()
  const dish = getDish(id)
  const navigate = useNavigate()
  const videoRef = useRef<HTMLVideoElement>(null)
  const stageRef = useRef<HTMLDivElement>(null)

  const [error, setError] = useState<string | null>(null)
  const [ready, setReady] = useState(false)
  const [scale, setScale] = useState(1)
  const [pos, setPos] = useState({ x: 0, y: 40 })
  const [tilt, setTilt] = useState({ beta: 58, gamma: 0 })
  const dragRef = useRef<{
    pointerId: number
    startX: number
    startY: number
    originX: number
    originY: number
  } | null>(null)

  useEffect(() => {
    let stream: MediaStream | null = null
    let cancelled = false

    async function start() {
      try {
        stream = await navigator.mediaDevices.getUserMedia({
          audio: false,
          video: {
            facingMode: { ideal: 'environment' },
            width: { ideal: 1280 },
            height: { ideal: 720 },
          },
        })
        if (cancelled) {
          stream.getTracks().forEach((t) => t.stop())
          return
        }
        const video = videoRef.current
        if (video) {
          video.srcObject = stream
          await video.play()
          setReady(true)
        }
      } catch {
        setError(
          'No se pudo abrir la cámara. Permití el acceso o probá en HTTPS desde el celular.',
        )
      }
    }

    void start()
    return () => {
      cancelled = true
      stream?.getTracks().forEach((t) => t.stop())
    }
  }, [])

  useEffect(() => {
    const onOrient = (e: DeviceOrientationEvent) => {
      if (typeof e.beta === 'number') {
        setTilt((t) => ({
          beta: Math.min(80, Math.max(35, e.beta ?? t.beta)),
          gamma: Math.min(25, Math.max(-25, e.gamma ?? 0)),
        }))
      }
    }

    type OrientRequestable = {
      requestPermission?: () => Promise<'granted' | 'denied'>
    }
    const DOE = DeviceOrientationEvent as unknown as OrientRequestable

    async function bind() {
      try {
        if (typeof DOE.requestPermission === 'function') {
          const state = await DOE.requestPermission()
          if (state !== 'granted') return
        }
      } catch {
        /* desktop / unsupported */
      }
      window.addEventListener('deviceorientation', onOrient)
    }

    void bind()
    return () => window.removeEventListener('deviceorientation', onOrient)
  }, [])

  const platePx = useMemo(() => {
    if (!dish) return 220
    return Math.max(64, dish.plateCm * BASE_PX_PER_CM * scale)
  }, [dish, scale])

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

  const rotateX = tilt.beta
  const rotateY = tilt.gamma * 0.45

  return (
    <div className="ar-page">
      <video
        ref={videoRef}
        className="ar-video"
        playsInline
        muted
        autoPlay
      />
      {!ready && !error && (
        <div className="ar-loading">
          <Camera size={28} />
          <p>Abriendo cámara…</p>
        </div>
      )}
      {error && (
        <div className="ar-loading">
          <p>{error}</p>
          <button type="button" className="btn btn-primary" onClick={() => navigate(-1)}>
            Volver
          </button>
        </div>
      )}

      <div
        ref={stageRef}
        className="ar-stage"
        onPointerDown={(e) => {
          if ((e.target as HTMLElement).closest('.ar-plate')) {
            dragRef.current = {
              pointerId: e.pointerId,
              startX: e.clientX,
              startY: e.clientY,
              originX: pos.x,
              originY: pos.y,
            }
            e.currentTarget.setPointerCapture(e.pointerId)
          }
        }}
        onPointerMove={(e) => {
          const d = dragRef.current
          if (!d || d.pointerId !== e.pointerId) return
          setPos({
            x: d.originX + (e.clientX - d.startX),
            y: d.originY + (e.clientY - d.startY),
          })
        }}
        onPointerUp={() => {
          dragRef.current = null
        }}
      >
        <div
          className="ar-plate-wrap"
          style={{
            transform: `translate(calc(-50% + ${pos.x}px), calc(-50% + ${pos.y}px)) perspective(900px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`,
            width: platePx,
            height: platePx,
          }}
        >
          <div className="ar-plate-shadow" />
          <div className="ar-plate">
            <SafeImage src={dish.image} alt={dish.name} />
            <div className="ar-plate-rim" />
          </div>
          <div className="ar-size-tag">
            Ø {dish.plateCm} cm · escala {(scale * 100).toFixed(0)}%
          </div>
        </div>
      </div>

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
            <span>Visión 3D en mesa</span>
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

      <footer className="ar-controls">
        <p className="ar-hint">
          Apuntá a la mesa, arrastrá el plato y ajustá el tamaño hasta que coincida con la
          porción real.
        </p>
        <div className="ar-scale-row">
          <button
            type="button"
            className="icon-btn"
            onClick={() => setScale((s) => Math.max(0.45, +(s - 0.08).toFixed(2)))}
            aria-label="Más chico"
          >
            <Minus size={16} />
          </button>
          <input
            type="range"
            min={0.45}
            max={1.8}
            step={0.01}
            value={scale}
            onChange={(e) => setScale(Number(e.target.value))}
            aria-label="Escala del plato"
          />
          <button
            type="button"
            className="icon-btn"
            onClick={() => setScale((s) => Math.min(1.8, +(s + 0.08).toFixed(2)))}
            aria-label="Más grande"
          >
            <Plus size={16} />
          </button>
          <button
            type="button"
            className="icon-btn"
            onClick={() => {
              setScale(1)
              setPos({ x: 0, y: 40 })
            }}
            aria-label="Reset"
          >
            <RotateCcw size={16} />
          </button>
        </div>
      </footer>
    </div>
  )
}
