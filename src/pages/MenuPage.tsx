import { useMemo, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { LayoutGrid, List, Plus, Scan } from 'lucide-react'
import { CategoryScroller } from '../components/CategoryScroller'
import { SafeImage } from '../components/SafeImage'
import { SearchBar } from '../components/SearchBar'
import { StarRating } from '../components/StarRating'
import { useCart } from '../context/CartContext'
import { categories, dishes, formatPrice, restaurant } from '../data/menu'

export function MenuPage() {
  const [params] = useSearchParams()
  const initialCat = params.get('cat') || categories[0].id
  const [activeCat, setActiveCat] = useState(initialCat)
  const [query, setQuery] = useState('')
  const [view, setView] = useState<'list' | 'grid'>('list')
  const { addItem } = useCart()

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    return dishes.filter((d) => {
      const matchCat = q ? true : d.categoryId === activeCat
      const matchQ =
        !q ||
        d.name.toLowerCase().includes(q) ||
        d.description.toLowerCase().includes(q)
      return matchCat && matchQ
    })
  }, [activeCat, query])

  return (
    <div className="menu-page">
      <header className="menu-header">
        <SafeImage className="menu-header-bg" src={restaurant.cover} alt="" />
        <div className="menu-header-content">
          <SafeImage className="menu-logo" src={restaurant.logo} alt="" />
          <h1>{restaurant.name.toUpperCase()}</h1>
        </div>
        <div className="accent-line" />
      </header>

      <div className="menu-toolbar sticky">
        <div className="toolbar-row">
          <SearchBar value={query} onChange={setQuery} />
          <div className="view-toggle">
            <button
              type="button"
              className={view === 'list' ? 'active' : ''}
              onClick={() => setView('list')}
              aria-label="Vista lista"
            >
              <List size={18} />
            </button>
            <button
              type="button"
              className={view === 'grid' ? 'active' : ''}
              onClick={() => setView('grid')}
              aria-label="Vista grilla"
            >
              <LayoutGrid size={18} />
            </button>
          </div>
        </div>
        {!query && (
          <CategoryScroller
            categories={categories}
            activeId={activeCat}
            onSelect={setActiveCat}
          />
        )}
      </div>

      {view === 'list' ? (
        <ul className="dish-list">
          {filtered.map((dish) => (
            <li key={dish.id} className="dish-row">
              <Link to={`/dish/${dish.id}`} className="dish-row-main">
                <SafeImage src={dish.image} alt="" />
                <div className="dish-row-text">
                  <strong>{dish.name}</strong>
                  <p>{dish.description}</p>
                  <StarRating value={dish.rating} size={12} />
                </div>
              </Link>
              <div className="dish-row-actions">
                <span>{formatPrice(dish.price)}</span>
                <div className="dish-row-btns">
                  <Link
                    to={`/dish/${dish.id}/ar`}
                    className="icon-ar"
                    aria-label={`Ver ${dish.name} en 3D`}
                  >
                    <Scan size={16} />
                  </Link>
                  <button
                    type="button"
                    className="icon-add"
                    onClick={() => addItem(dish)}
                    aria-label={`Agregar ${dish.name}`}
                  >
                    <Plus size={18} />
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <div className="dish-grid">
          {filtered.map((dish) => (
            <article key={dish.id} className="dish-card">
              <Link to={`/dish/${dish.id}`}>
                <SafeImage src={dish.image} alt={dish.name} />
                <div className="dish-card-body">
                  <strong>{dish.name}</strong>
                  <span>{formatPrice(dish.price)}</span>
                </div>
              </Link>
              <div className="dish-card-actions">
                <Link to={`/dish/${dish.id}/ar`} className="btn btn-ghost btn-sm">
                  <Scan size={14} /> 3D
                </Link>
                <button
                  type="button"
                  className="btn btn-primary btn-sm"
                  onClick={() => addItem(dish)}
                >
                  Agregar
                </button>
              </div>
            </article>
          ))}
        </div>
      )}

      {filtered.length === 0 && (
        <p className="empty">No encontramos platos con esa búsqueda.</p>
      )}
    </div>
  )
}
