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
    'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1200&q=80',
  logo:
    'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=200&q=80',
  address: 'Av. Corrientes 1234, CABA',
  tableCode: 'MESA-12',
}

export const categories: Category[] = [
  {
    id: 'entradas',
    name: 'Entradas',
    image:
      'https://images.unsplash.com/photo-1541014741259-de529411b96a?w=400&q=80',
  },
  {
    id: 'principales',
    name: 'Principales',
    image:
      'https://images.unsplash.com/photo-1604908177522-44078c363795?w=400&q=80',
  },
  {
    id: 'acompanamientos',
    name: 'Acompañamientos',
    image:
      'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400&q=80',
  },
  {
    id: 'bebidas',
    name: 'Bebidas',
    image:
      'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=400&q=80',
  },
  {
    id: 'postres',
    name: 'Postres',
    image:
      'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=400&q=80',
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
      'https://images.unsplash.com/photo-1544025162-d76694265947?w=900&q=80',
    rating: 4.8,
    reviewsCount: 24,
  },
  {
    id: 'ensalada',
    categoryId: 'entradas',
    name: 'Ensalada mixta',
    description: 'Hojas verdes, tomate cherry, queso y vinagreta cítrica.',
    price: 6200,
    image:
      'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=900&q=80',
    rating: 4.5,
    reviewsCount: 18,
  },
  {
    id: 'empanadas',
    categoryId: 'entradas',
    name: 'Empanadas criollas',
    description: 'Trío de empanadas de carne, humita y queso.',
    price: 7800,
    image:
      'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=900&q=80',
    rating: 4.9,
    reviewsCount: 41,
  },
  {
    id: 'milanesa',
    categoryId: 'principales',
    name: 'Milanesa de pollo',
    description: 'Milanesa dorada con puré cremoso y limón.',
    price: 18000,
    image:
      'https://images.unsplash.com/photo-1632778149955-e80f8ceca2e8?w=900&q=80',
    rating: 4.9,
    reviewsCount: 67,
  },
  {
    id: 'bife',
    categoryId: 'principales',
    name: 'Bife de chorizo',
    description: 'Corte premium a la parrilla, punto a elección.',
    price: 24500,
    image:
      'https://images.unsplash.com/photo-1558030006-450675393462?w=900&q=80',
    rating: 4.7,
    reviewsCount: 52,
  },
  {
    id: 'pasta',
    categoryId: 'principales',
    name: 'Ravioles de ricota',
    description: 'Pasta casera con salsa rosa y albahaca.',
    price: 15600,
    image:
      'https://images.unsplash.com/photo-1587740908075-9e245070dfaa?w=900&q=80',
    rating: 4.6,
    reviewsCount: 33,
  },
  {
    id: 'burger',
    categoryId: 'principales',
    name: 'Burger casa',
    description: 'Doble blend, cheddar, panceta y papas.',
    price: 14200,
    image:
      'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=900&q=80',
    rating: 4.8,
    reviewsCount: 88,
  },
  {
    id: 'papas',
    categoryId: 'acompanamientos',
    name: 'Papas fritas',
    description: 'Corte grueso, sal marina y alioli.',
    price: 4500,
    image:
      'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=900&q=80',
    rating: 4.4,
    reviewsCount: 29,
  },
  {
    id: 'pure',
    categoryId: 'acompanamientos',
    name: 'Puré de papas',
    description: 'Cremoso con manteca y nuez moscada.',
    price: 4200,
    image:
      'https://images.unsplash.com/photo-1600177517093-46939c6f6e1c?w=900&q=80',
    rating: 4.3,
    reviewsCount: 15,
  },
  {
    id: 'ensalada-cesar',
    categoryId: 'acompanamientos',
    name: 'Ensalada César',
    description: 'Lechuga, crutones, parmesano y aderezo César.',
    price: 5800,
    image:
      'https://images.unsplash.com/photo-1550304943-4f24f54ddde9?w=900&q=80',
    rating: 4.5,
    reviewsCount: 22,
  },
  {
    id: 'limonada',
    categoryId: 'bebidas',
    name: 'Limonada casera',
    description: 'Limón, menta y un toque de jengibre.',
    price: 3800,
    image:
      'https://images.unsplash.com/photo-1621263764928-df1442735f6b?w=900&q=80',
    rating: 4.7,
    reviewsCount: 36,
  },
  {
    id: 'vino',
    categoryId: 'bebidas',
    name: 'Copa de Malbec',
    description: 'Selección de la casa, cuerpo medio.',
    price: 7200,
    image:
      'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=900&q=80',
    rating: 4.8,
    reviewsCount: 44,
  },
  {
    id: 'cerveza',
    categoryId: 'bebidas',
    name: 'Cerveza artesanal',
    description: 'IPA local, 473 ml.',
    price: 5500,
    image:
      'https://images.unsplash.com/photo-1608270586620-248524c67de9?w=900&q=80',
    rating: 4.6,
    reviewsCount: 31,
  },
  {
    id: 'tiramisu',
    categoryId: 'postres',
    name: 'Tiramisú',
    description: 'Clásico italiano con cacao amargo.',
    price: 6800,
    image:
      'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=900&q=80',
    rating: 4.9,
    reviewsCount: 55,
  },
  {
    id: 'flan',
    categoryId: 'postres',
    name: 'Flan casero',
    description: 'Con dulce de leche y crema.',
    price: 5200,
    image:
      'https://images.unsplash.com/photo-1524351199678-941a58a3df50?w=900&q=80',
    rating: 4.7,
    reviewsCount: 27,
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
