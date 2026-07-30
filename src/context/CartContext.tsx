import {
  createContext,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import type { Dish } from '../data/menu'

export type CartItem = {
  dish: Dish
  qty: number
}

type CartContextValue = {
  items: CartItem[]
  addItem: (dish: Dish, qty?: number) => void
  removeItem: (dishId: string) => void
  setQty: (dishId: string, qty: number) => void
  clear: () => void
  totalItems: number
  totalPrice: number
}

const CartContext = createContext<CartContextValue | null>(null)

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([])

  const value = useMemo<CartContextValue>(() => {
    const addItem = (dish: Dish, qty = 1) => {
      setItems((prev) => {
        const existing = prev.find((i) => i.dish.id === dish.id)
        if (existing) {
          return prev.map((i) =>
            i.dish.id === dish.id ? { ...i, qty: i.qty + qty } : i,
          )
        }
        return [...prev, { dish, qty }]
      })
    }

    const removeItem = (dishId: string) => {
      setItems((prev) => prev.filter((i) => i.dish.id !== dishId))
    }

    const setQty = (dishId: string, qty: number) => {
      if (qty <= 0) {
        removeItem(dishId)
        return
      }
      setItems((prev) =>
        prev.map((i) => (i.dish.id === dishId ? { ...i, qty } : i)),
      )
    }

    const clear = () => setItems([])

    const totalItems = items.reduce((acc, i) => acc + i.qty, 0)
    const totalPrice = items.reduce((acc, i) => acc + i.dish.price * i.qty, 0)

    return {
      items,
      addItem,
      removeItem,
      setQty,
      clear,
      totalItems,
      totalPrice,
    }
  }, [items])

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart must be used within CartProvider')
  return ctx
}
