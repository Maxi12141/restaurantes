import { useState } from 'react'

const FALLBACK =
  'data:image/svg+xml;utf8,' +
  encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="400" height="400" viewBox="0 0 400 400">
      <defs>
        <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stop-color="#2a2a32"/>
          <stop offset="100%" stop-color="#17171c"/>
        </linearGradient>
      </defs>
      <rect width="400" height="400" fill="url(#g)"/>
      <circle cx="200" cy="180" r="70" fill="none" stroke="#ff6a2b" stroke-width="6"/>
      <text x="200" y="300" text-anchor="middle" fill="#9a968c" font-family="sans-serif" font-size="22">Plato</text>
    </svg>`,
  )

type Props = {
  src: string
  alt?: string
  className?: string
}

export function SafeImage({ src, alt = '', className }: Props) {
  const [current, setCurrent] = useState(src)

  return (
    <img
      className={className}
      src={current}
      alt={alt}
      loading="lazy"
      decoding="async"
      referrerPolicy="no-referrer"
      onError={() => {
        if (current !== FALLBACK) setCurrent(FALLBACK)
      }}
    />
  )
}
