import type { Category } from '../data/menu'
import { SafeImage } from './SafeImage'

type Props = {
  categories: Category[]
  activeId: string
  onSelect: (id: string) => void
}

export function CategoryScroller({ categories, activeId, onSelect }: Props) {
  return (
    <div className="category-scroller" role="tablist" aria-label="Categorías">
      {categories.map((cat) => {
        const active = cat.id === activeId
        return (
          <button
            key={cat.id}
            type="button"
            role="tab"
            aria-selected={active}
            className={`category-chip ${active ? 'active' : ''}`}
            onClick={() => onSelect(cat.id)}
          >
            <SafeImage src={cat.image} alt="" />
            <span>{cat.name}</span>
          </button>
        )
      })}
    </div>
  )
}
