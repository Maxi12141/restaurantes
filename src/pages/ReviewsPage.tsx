import { MessageSquareHeart } from 'lucide-react'
import { StarRating } from '../components/StarRating'
import { reviews } from '../data/menu'

export function ReviewsPage() {
  return (
    <div className="reviews-page">
      <header className="page-header">
        <MessageSquareHeart size={22} />
        <div>
          <h1>Opiniones</h1>
          <p>Feedback de clientes sobre los platos presentados</p>
        </div>
      </header>

      <ul className="review-list">
        {reviews.map((r) => (
          <li key={r.id} className="review-card dark">
            <div className="review-head">
              <div>
                <strong>{r.author}</strong>
                <span className="muted">{r.dishName}</span>
              </div>
              <StarRating value={r.rating} size={14} />
            </div>
            <p>{r.comment}</p>
            <time>{r.date}</time>
          </li>
        ))}
      </ul>
    </div>
  )
}
