import { Star } from 'lucide-react'

type Props = {
  value: number
  size?: number
  interactive?: boolean
  onChange?: (value: number) => void
}

export function StarRating({
  value,
  size = 16,
  interactive = false,
  onChange,
}: Props) {
  return (
    <div className="stars" role={interactive ? 'radiogroup' : 'img'} aria-label={`${value} de 5`}>
      {Array.from({ length: 5 }, (_, i) => {
        const n = i + 1
        const filled = n <= Math.round(value)
        return (
          <button
            key={n}
            type="button"
            className={`star ${filled ? 'filled' : ''} ${interactive ? 'interactive' : ''}`}
            disabled={!interactive}
            onClick={() => onChange?.(n)}
            aria-label={`${n} estrellas`}
          >
            <Star size={size} fill={filled ? 'currentColor' : 'none'} />
          </button>
        )
      })}
    </div>
  )
}
