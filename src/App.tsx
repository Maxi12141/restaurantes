import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { CartProvider } from './context/CartContext'
import { Layout } from './components/Layout'
import { HomePage } from './pages/HomePage'
import { MenuPage } from './pages/MenuPage'
import { DishDetailPage } from './pages/DishDetailPage'
import { ReviewsPage } from './pages/ReviewsPage'
import { CartPage } from './pages/CartPage'
import { QrPage } from './pages/QrPage'

export default function App() {
  return (
    <CartProvider>
      <BrowserRouter>
        <Routes>
          <Route element={<Layout />}>
            <Route index element={<HomePage />} />
            <Route path="menu" element={<MenuPage />} />
            <Route path="dish/:id" element={<DishDetailPage />} />
            <Route path="reviews" element={<ReviewsPage />} />
            <Route path="cart" element={<CartPage />} />
            <Route path="qr" element={<QrPage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </CartProvider>
  )
}
