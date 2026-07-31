export type Category = {
  id: string
  name: string
  image: string
}

export type Dish = {
  id: string
  categoryId: string
  name: string
  description: string
  price: number
  image: string
  rating: number
  reviewsCount: number
  /** Diámetro real aproximado del plato/vaso en centímetros */
  plateCm: number
  /** Tipo de plato GLB; por defecto `white` si falta. */
  plateType?: 'white' | 'black' | 'ceramic'
  /** Tipo de comida GLB; por defecto `burger` si falta. */
  foodType?: 'burger' | 'milanesa' | 'pasta' | 'pizza'
  contents: string[]
}

export type Review = {
  id: string
  author: string
  dishName: string
  rating: number
  comment: string
  date: string
}

export const restaurant = {
  name: 'Ocho Mujeres',
  tagline: 'Cocina de autor para presentar en mesa',
  cover:
    'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1200&q=80',
  logo:
    'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&w=200&q=80',
  address: 'Av. Corrientes 1234, CABA',
  tableCode: 'MESA-12',
}

export const categories: Category[] = [
  {
    id: 'entradas',
    name: 'Entradas',
    image:
      'https://images.unsplash.com/photo-1541014741259-de529411b96a?auto=format&fit=crop&w=400&q=80',
  },
  {
    id: 'principales',
    name: 'Principales',
    image:
      'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=400&q=80',
  },
  {
    id: 'acompanamientos',
    name: 'Guarnición',
    image:
      'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=400&q=80',
  },
  {
    id: 'bebidas',
    name: 'Bebidas',
    image:
      'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&w=400&q=80',
  },
  {
    id: 'postres',
    name: 'Postres',
    image:
      'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?auto=format&fit=crop&w=400&q=80',
  },
]

export const dishes: Dish[] = [
  {
    id: 'mollejas',
    categoryId: 'entradas',
    name: 'Mollejas de pollo',
    description: 'Mollejas crocantes con limón y perejil fresco.',
    price: 8500,
    image:
      'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=900&q=80',
    rating: 4.8,
    reviewsCount: 24,
    plateCm: 22,
    plateType: 'white',
    foodType: 'burger',
    contents: ['Mollejas', 'Limón', 'Perejil'],
  },
  {
    id: 'ensalada',
    categoryId: 'entradas',
    name: 'Ensalada mixta',
    description: 'Hojas verdes, tomate cherry, queso y vinagreta cítrica.',
    price: 6200,
    image:
      'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=900&q=80',
    rating: 4.5,
    reviewsCount: 18,
    plateCm: 24,
    plateType: 'white',
    foodType: 'burger',
    contents: ['Hojas verdes', 'Cherry', 'Queso', 'Vinagreta'],
  },
  {
    id: 'empanadas',
    categoryId: 'entradas',
    name: 'Empanadas criollas',
    description: 'Trío de empanadas de carne, humita y queso.',
    price: 7800,
    image:
      'https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=900&q=80',
    rating: 4.9,
    reviewsCount: 41,
    plateCm: 26,
    plateType: 'white',
    foodType: 'burger',
    contents: ['Carne', 'Humita', 'Queso'],
  },
  {
    id: 'milanesa',
    categoryId: 'principales',
    name: 'Milanesa de pollo',
    description: 'Milanesa dorada con puré cremoso y limón.',
    price: 18000,
    image:
      'https://images.unsplash.com/photo-1632778149955-e80f8ceca2e8?auto=format&fit=crop&w=900&q=80',
    rating: 4.9,
    reviewsCount: 67,
    plateCm: 28,
    plateType: 'ceramic',
    foodType: 'milanesa',
    contents: ['Milanesa de pollo', 'Puré', 'Limón', 'Verdes'],
  },
  {
    id: 'bife',
    categoryId: 'principales',
    name: 'Bife de chorizo',
    description: 'Corte premium a la parrilla, punto a elección.',
    price: 24500,
    image:
      'https://images.unsplash.com/photo-1558030006-450675393462?auto=format&fit=crop&w=900&q=80',
    rating: 4.7,
    reviewsCount: 52,
    plateCm: 30,
    plateType: 'white',
    foodType: 'burger',
    contents: ['Bife de chorizo', 'Sal gruesa'],
  },
  {
    id: 'pasta',
    categoryId: 'principales',
    name: 'Ravioles de ricota',
    description: 'Pasta casera con salsa rosa y albahaca.',
    price: 15600,
    image:
      'https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?auto=format&fit=crop&w=900&q=80',
    rating: 4.6,
    reviewsCount: 33,
    plateCm: 26,
    plateType: 'white',
    foodType: 'pasta',
    contents: ['Ravioles', 'Salsa rosa', 'Albahaca'],
  },
  {
    id: 'burger',
    categoryId: 'principales',
    name: 'Burger casa',
    description: 'Doble blend, cheddar, panceta y papas.',
    price: 14200,
    image:
      'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=900&q=80',
    rating: 4.8,
    reviewsCount: 88,
    plateCm: 24,
    plateType: 'white',
    foodType: 'burger',
    contents: ['Doble blend', 'Cheddar', 'Panceta', 'Papas'],
  },
  {
    id: 'papas',
    categoryId: 'acompanamientos',
    name: 'Papas fritas',
    description: 'Corte grueso, sal marina y alioli.',
    price: 4500,
    image:
      'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?auto=format&fit=crop&w=900&q=80',
    rating: 4.4,
    reviewsCount: 29,
    plateCm: 18,
    plateType: 'white',
    foodType: 'burger',
    contents: ['Papas', 'Alioli'],
  },
  {
    id: 'pure',
    categoryId: 'acompanamientos',
    name: 'Puré de papas',
    description: 'Cremoso con manteca y nuez moscada.',
    price: 4200,
    image:
      'https://images.unsplash.com/photo-1585238342024-78d387f4a707?auto=format&fit=crop&w=900&q=80',
    rating: 4.3,
    reviewsCount: 15,
    plateCm: 16,
    plateType: 'white',
    foodType: 'burger',
    contents: ['Puré', 'Manteca'],
  },
  {
    id: 'ensalada-cesar',
    categoryId: 'acompanamientos',
    name: 'Ensalada César',
    description: 'Lechuga, crutones, parmesano y aderezo César.',
    price: 5800,
    image:
      'https://images.unsplash.com/photo-1550304943-4f24f54ddde9?auto=format&fit=crop&w=900&q=80',
    rating: 4.5,
    reviewsCount: 22,
    plateCm: 22,
    plateType: 'white',
    foodType: 'burger',
    contents: ['Lechuga', 'Crutones', 'Parmesano'],
  },
  {
    id: 'limonada',
    categoryId: 'bebidas',
    name: 'Limonada casera',
    description: 'Limón, menta y un toque de jengibre.',
    price: 3800,
    image:
      'https://images.unsplash.com/photo-1622597467836-f3285f2131b8?auto=format&fit=crop&w=900&q=80',
    rating: 4.7,
    reviewsCount: 36,
    plateCm: 8,
    plateType: 'white',
    foodType: 'burger',
    contents: ['Limón', 'Menta', 'Jengibre'],
  },
  {
    id: 'vino',
    categoryId: 'bebidas',
    name: 'Copa de Malbec',
    description: 'Selección de la casa, cuerpo medio.',
    price: 7200,
    image:
      'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?auto=format&fit=crop&w=900&q=80',
    rating: 4.8,
    reviewsCount: 44,
    plateCm: 8,
    plateType: 'white',
    foodType: 'burger',
    contents: ['Malbec'],
  },
  {
    id: 'cerveza',
    categoryId: 'bebidas',
    name: 'Cerveza artesanal',
    description: 'IPA local, 473 ml.',
    price: 5500,
    image:
      'https://images.unsplash.com/photo-1608270586620-248524c67de9?auto=format&fit=crop&w=900&q=80',
    rating: 4.6,
    reviewsCount: 31,
    plateCm: 7,
    plateType: 'white',
    foodType: 'burger',
    contents: ['IPA 473 ml'],
  },
  {
    id: 'tiramisu',
    categoryId: 'postres',
    name: 'Tiramisú',
    description: 'Clásico italiano con cacao amargo.',
    price: 6800,
    image:
      'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?auto=format&fit=crop&w=900&q=80',
    rating: 4.9,
    reviewsCount: 55,
    plateCm: 16,
    plateType: 'white',
    foodType: 'burger',
    contents: ['Mascarpone', 'Café', 'Cacao'],
  },
  {
    id: 'flan',
    categoryId: 'postres',
    name: 'Flan casero',
    description: 'Con dulce de leche y crema.',
    price: 5200,
    image:
      'https://images.unsplash.com/photo-1524351199678-941a58a3df50?auto=format&fit=crop&w=900&q=80',
    rating: 4.7,
    reviewsCount: 27,
    plateCm: 14,
    plateType: 'white',
    foodType: 'burger',
    contents: ['Flan', 'Dulce de leche', 'Crema'],
  },
]

export const reviews: Review[] = [
  {
    id: 'r1',
    author: 'Cena',
    dishName: 'Milanesa de pollo',
    rating: 5,
    comment: 'Se veía exactamente igual a la foto. Perfecta.',
    date: 'Hoy',
  },
  {
    id: 'r2',
    author: 'Diego',
    dishName: 'Bife de chorizo',
    rating: 5,
    comment: 'Ideal para mostrar el plato antes de pedir.',
    date: 'Ayer',
  },
  {
    id: 'r3',
    author: 'Lucía',
    dishName: 'Tiramisú',
    rating: 4,
    comment: 'Muy rico, porción generosa.',
    date: 'Hace 3 días',
  },
  {
    id: 'r4',
    author: 'Martín',
    dishName: 'Burger casa',
    rating: 5,
    comment: 'El mozo nos la presentó por la app y pedimos al toque.',
    date: 'Hace 1 semana',
  },
]

export function formatPrice(value: number) {
  return new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'ARS',
    maximumFractionDigits: 0,
  }).format(value)
}

export function getDish(id: string) {
  return dishes.find((d) => d.id === id)
}
