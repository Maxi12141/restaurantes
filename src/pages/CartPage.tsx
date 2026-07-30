import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Minus, Plus, Trash2 } from 'lucide-react'
import { useCart } from '../context/CartContext'
import { formatPrice } from '../data/menu'

export function CartPage() {
  const { items, setQty, removeItem, clear, totalPrice, totalItems } = useCart()
  const [done, setDone] = useState(false)

  if (done) {
    return (
      <div className="cart-page empty-state">
        <h1>Pedido enviado</h1>
        <p>El pedido quedó listo para cocina / caja.</p>
        <Link to="/menu" className="btn btn-primary" onClick={() => setDone(false)}>
          Seguir presentando
        </Link>
      </div>
    )
  }

  if (items.length === 0) {
    return (
      <div className="cart-page empty-state">
        <h1>Pedido vacío</h1>
        <p>Agregá platos desde el menú para armar el pedido.</p>
        <Link to="/menu" className="btn btn-primary">
          Ir al menú
        </Link>
      </div>
    )
  }

  return (
    <div className="cart-page">
      <header className="page-header">
        <div>
          <h1>Pedido</h1>
          <p>
            {totalItems} ítem{totalItems === 1 ? '' : 's'}
          </p>
        </div>
        <button type="button" className="text-link" onClick={clear}>
          Vaciar
        </button>
      </header>

      <ul className="cart-list">
        {items.map(({ dish, qty }) => (
          <li key={dish.id} className="cart-item">
            <img src={dish.image} alt="" />
            <div className="cart-item-info">
              <strong>{dish.name}</strong>
              <span>{formatPrice(dish.price)}</span>
              <div className="qty">
                <button type="button" onClick={() => setQty(dish.id, qty - 1)}>
                  <Minus size={14} />
                </button>
                <em>{qty}</em>
                <button type="button" onClick={() => setQty(dish.id, qty + 1)}>
                  <Plus size={14} />
                </button>
              </div>
            </div>
            <button
              type="button"
              className="icon-btn danger"
              onClick={() => removeItem(dish.id)}
              aria-label="Quitar"
            >
              <Trash2 size={16} />
            </button>
          </li>
        ))}
      </ul>

      <footer className="cart-footer">
        <div className="cart-total">
          <span>Total</span>
          <strong>{formatPrice(totalPrice)}</strong>
        </div>
        <button
          type="button"
          className="btn btn-primary btn-block"
          onClick={() => {
            clear()
            setDone(true)
          }}
        >
          Confirmar pedido
        </button>
      </footer>
    </div>
  )
}
