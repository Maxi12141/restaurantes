import { Link } from 'react-router-dom'
import { ArrowRight, MapPin, Sparkles } from 'lucide-react'
import { categories, dishes, formatPrice, restaurant } from '../data/menu'

export function HomePage() {
  const featured = dishes.filter((d) =>
    ['milanesa', 'bife', 'tiramisu', 'burger'].includes(d.id),
  )

  return (
    <div className="home">
      <header className="home-hero">
        <img className="home-cover" src={restaurant.cover} alt="" />
        <div className="home-hero-overlay" />
        <div className="home-brand">
          <img className="home-logo" src={restaurant.logo} alt="" />
          <h1>{restaurant.name}</h1>
          <p>{restaurant.tagline}</p>
          <div className="home-meta">
            <MapPin size={14} />
            <span>{restaurant.address}</span>
          </div>
        </div>
      </header>

      <section className="section">
        <div className="section-head">
          <h2>Presentá el menú</h2>
          <Link to="/menu" className="text-link">
            Ver todo <ArrowRight size={14} />
          </Link>
        </div>
        <p className="section-lead">
          Mostrá fotos reales, precios y opiniones al cliente en la mesa.
        </p>
        <div className="home-cats">
          {categories.map((cat) => (
            <Link key={cat.id} to={`/menu?cat=${cat.id}`} className="home-cat">
              <img src={cat.image} alt="" />
              <span>{cat.name}</span>
            </Link>
          ))}
        </div>
      </section>

      <section className="section">
        <div className="section-head">
          <h2>
            <Sparkles size={18} /> Destacados
          </h2>
        </div>
        <div className="featured-rail">
          {featured.map((dish) => (
            <Link key={dish.id} to={`/dish/${dish.id}`} className="featured-card">
              <img src={dish.image} alt={dish.name} />
              <div>
                <strong>{dish.name}</strong>
                <span>{formatPrice(dish.price)}</span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="section home-cta-block">
        <Link to="/menu" className="btn btn-primary btn-block">
          Abrir menú para presentar
        </Link>
        <Link to="/qr" className="btn btn-ghost btn-block">
          Mostrar QR de mesa
        </Link>
      </section>
    </div>
  )
}
