import { NavLink } from 'react-router-dom'
import { Bell, Home, QrCode, ShoppingBag, UtensilsCrossed } from 'lucide-react'
import { useCart } from '../context/CartContext'

const linkClass = ({ isActive }: { isActive: boolean }) =>
  `nav-item${isActive ? ' active' : ''}`

export function BottomNav() {
  const { totalItems } = useCart()

  return (
    <nav className="bottom-nav" aria-label="Navegación principal">
      <NavLink to="/" end className={linkClass}>
        <Home size={22} />
        <span>Inicio</span>
      </NavLink>
      <NavLink to="/menu" className={linkClass}>
        <UtensilsCrossed size={22} />
        <span>Menú</span>
      </NavLink>
      <NavLink to="/qr" className={linkClass}>
        <span className="cta-orb">
          <QrCode size={22} />
        </span>
        <span>QR</span>
      </NavLink>
      <NavLink to="/reviews" className={linkClass}>
        <Bell size={22} />
        <span>Opiniones</span>
      </NavLink>
      <NavLink to="/cart" className={linkClass}>
        <span className="badge-wrap">
          <ShoppingBag size={22} />
          {totalItems > 0 && <em className="badge">{totalItems}</em>}
        </span>
        <span>Pedido</span>
      </NavLink>
    </nav>
  )
}
