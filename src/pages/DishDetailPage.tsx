import { useMemo, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { Check, Scan, X } from 'lucide-react'
import { requestOrientationPermission } from '../ar/deviceOrientation'
import { SafeImage } from '../components/SafeImage'
import { StarRating } from '../components/StarRating'
import { useCart } from '../context/CartContext'
import {
  categories,
  dishes,
  formatPrice,
  getDish,
  reviews,
} from '../data/menu'

export function DishDetailPage() {
  const { id = '' } = useParams()
  const dish = getDish(id)
  const navigate = useNavigate()
  const { addItem } = useCart()
  const [opinion, setOpinion] = useState(5)
  const [comment, setComment] = useState('')
  const [sent, setSent] = useState(false)
  const [added, setAdded] = useState(false)

  const siblings = useMemo(() => {
    if (!dish) return []
    return dishes.filter((d) => d.categoryId === dish.categoryId)
  }, [dish])

  if (!dish) {
    return (
      <div className="detail empty-state">
        <p>Plato no encontrado.</p>
        <Link to="/menu" className="btn btn-primary">
          Volver al menú
        </Link>
      </div>
    )
  }

  const category = categories.find((c) => c.id === dish.categoryId)
  const dishReviews = reviews.filter((r) => r.dishName === dish.name)

  const handleAdd = () => {
    addItem(dish)
    setAdded(true)
    window.setTimeout(() => setAdded(false), 1600)
  }

  return (
    <div className="detail">
      <header className="detail-top">
        <button
          type="button"
          className="close-btn"
          onClick={() => navigate(-1)}
          aria-label="Cerrar"
        >
          <X size={20} />
        </button>
        <div className="detail-cats">
          {siblings.map((s) => (
            <Link
              key={s.id}
              to={`/dish/${s.id}`}
              className={`mini-thumb ${s.id === dish.id ? 'active' : ''}`}
            >
              <SafeImage src={s.image} alt={s.name} />
            </Link>
          ))}
        </div>
      </header>

      <div className="detail-hero">
        <SafeImage src={dish.image} alt={dish.name} className="detail-circle" />
      </div>

      <div className="detail-body">
        <p className="eyebrow">{category?.name}</p>
        <h1>{dish.name}</h1>
        <p className="detail-desc">{dish.description}</p>
        <div className="detail-rating-row">
          <StarRating value={dish.rating} size={18} />
          <span>
            {dish.rating.toFixed(1)} · {dish.reviewsCount} opiniones
          </span>
        </div>
        <p className="detail-meta">
          Tamaño real aprox. Ø {dish.plateCm} cm · {dish.contents.join(' · ')}
        </p>
        <p className="detail-price">{formatPrice(dish.price)}</p>

        <div className="detail-actions">
          <button
            type="button"
            className="btn btn-ar btn-block"
            onClick={async () => {
              await requestOrientationPermission()
              navigate(`/dish/${dish.id}/ar`)
            }}
          >
            <Scan size={18} /> Ver en mesa 3D (cámara)
          </button>
          <button
            type="button"
            className="btn btn-primary btn-block"
            onClick={handleAdd}
          >
            {added ? (
              <>
                <Check size={18} /> Agregado al pedido
              </>
            ) : (
              'Agregar al pedido'
            )}
          </button>
        </div>

        <section className="opinion-box">
          <h2>Tu opinión importa</h2>
          <StarRating
            value={opinion}
            size={22}
            interactive
            onChange={setOpinion}
          />
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="¿Qué te pareció este plato?"
            rows={3}
          />
          <button
            type="button"
            className="btn btn-primary btn-block"
            onClick={() => {
              setSent(true)
              setComment('')
            }}
          >
            {sent ? '¡Gracias por tu reseña!' : 'Enviar reseña'}
          </button>
        </section>

        {dishReviews.length > 0 && (
          <section className="detail-reviews">
            <h2>Opiniones recientes</h2>
            {dishReviews.map((r) => (
              <article key={r.id} className="review-card">
                <div className="review-head">
                  <strong>{r.author}</strong>
                  <StarRating value={r.rating} size={12} />
                </div>
                <p>{r.comment}</p>
              </article>
            ))}
          </section>
        )}
      </div>
    </div>
  )
}
