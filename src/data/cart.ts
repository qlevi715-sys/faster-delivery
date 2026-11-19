// DATA HARDCODEADA solo para maquetación (luego se reemplaza por el servicio de órdenes)
export interface CartItem {
  id: number
  name: string
  description: string
  price: number
  quantity: number
  image: string
}

export const INITIAL_CART_ITEMS: CartItem[] = [
  {
    id: 1,
    name: "Premium Wagyu Burger",
    description: "Extra pickles, no onions, brioche bun.",
    price: 18.5,
    quantity: 1,
    image:
      "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=400&q=80"
  },
  {
    id: 2,
    name: "Superfood Harvest Bowl",
    description: "Gluten-free, vegan, maple-tahini dressing.",
    price: 14.2,
    quantity: 2,
    image:
      "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=400&q=80"
  },
  {
    id: 3,
    name: "Signature Cold Brew",
    description: "Large (16oz), Oat milk, Vanilla syrup.",
    price: 5.5,
    quantity: 1,
    image:
      "https://images.unsplash.com/photo-1461023058943-07fcbe16d735?auto=format&fit=crop&w=400&q=80"
  }
]
