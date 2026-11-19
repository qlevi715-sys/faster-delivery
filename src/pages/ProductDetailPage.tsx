import { useState } from "react";
import type React from "react";
import { Link } from "react-router-dom";
import {
  ChevronDown,
  ChevronRight,
  Clock,
  Heart,
  Minus,
  Plus,
  ShieldCheck,
  ShoppingBasket,
  Star,
  StarHalf,
  Truck
} from "lucide-react";
import { toast } from "sonner";

// ---------------------------------------------------------------------------
// DATA HARDCODEADA (luego se puede reemplazar por la respuesta de la API)
// ---------------------------------------------------------------------------
const PRODUCT = {
  name: "Truffle Umami Burger",
  category: "Fast Food",
  rating: 4.5,
  reviews: "1.2k",
  description:
    "A masterclass in savory flavors. Our signature Wagyu beef blend, hand-pressed and seared, layered with house-made black truffle aioli, sautéed balsamic wild mushrooms, and melted aged Gruyère. All cradled in a toasted, buttered artisan brioche bun.",
  price: 18.5,
  images: [
    "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1550547660-d9450f859349?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=1200&q=80"
  ]
};

const TOPPINGS = [
  { id: "aioli", name: "Extra Truffle Aioli", price: 1.5 },
  { id: "bacon", name: "Crispy Bacon Stripes", price: 2.5 },
  { id: "egg", name: "Fried Egg", price: 2.0 }
];

const SIDES = [
  { id: "truffle-fries", name: "Truffle Parmesan Fries", extra: 0 },
  { id: "sweet-potato", name: "Sweet Potato Fries", extra: 1.5 },
  { id: "side-salad", name: "Garden Side Salad", extra: 1.0 }
];

const LOGISTICS = [
  {
    icon: Truck,
    title: "Free delivery",
    text: "On orders over $25 within your zone."
  },
  {
    icon: Clock,
    title: "25 – 35 min",
    text: "Estimated arrival, hot and fresh at your door."
  },
  {
    icon: ShieldCheck,
    title: "Freshness guaranteed",
    text: "Not happy? We'll make it right or refund you."
  }
];

const MAX_QUANTITY = 10;

const money = (value: number) => `$${value.toFixed(2)}`;

// ---------------------------------------------------------------------------
// Estrellas (soporta media estrella)
// ---------------------------------------------------------------------------
const StarRating: React.FC<{ rating: number }> = ({ rating }) => (
  <div className="flex items-center text-amber-800" aria-label={`${rating} de 5 estrellas`}>
    {Array.from({ length: 5 }, (_, i) => {
      const position = i + 1;
      if (rating >= position) {
        return <Star key={i} size={22} fill="currentColor" strokeWidth={1.5} />;
      }
      if (rating >= position - 0.5) {
        return (
          <span key={i} className="relative inline-flex">
            <Star size={22} strokeWidth={1.5} />
            <StarHalf
              size={22}
              fill="currentColor"
              strokeWidth={1.5}
              className="absolute inset-0"
            />
          </span>
        );
      }
      return <Star key={i} size={22} strokeWidth={1.5} />;
    })}
  </div>
);

// ---------------------------------------------------------------------------
// Página
// ---------------------------------------------------------------------------
export const ProductDetailPage: React.FC = () => {
  const [activeImage, setActiveImage] = useState(0);
  const [isFavorite, setIsFavorite] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [selectedToppings, setSelectedToppings] = useState<string[]>([]);
  const [sideId, setSideId] = useState(SIDES[0].id);

  const toggleTopping = (id: string) => {
    setSelectedToppings((current) =>
      current.includes(id) ? current.filter((t) => t !== id) : [...current, id]
    );
  };

  const toppingsTotal = TOPPINGS.filter((t) => selectedToppings.includes(t.id)).reduce(
    (sum, t) => sum + t.price,
    0
  );
  const sideExtra = SIDES.find((s) => s.id === sideId)?.extra ?? 0;
  const total = (PRODUCT.price + toppingsTotal + sideExtra) * quantity;

  const handleAddToCart = () => {
    toast.success(`${quantity} × ${PRODUCT.name} agregado al carrito`);
  };

  return (
    <div className="mx-auto max-w-7xl">
      {/* RUTA DE NAVEGACIÓN */}
      <nav aria-label="Breadcrumb" className="mb-6">
        <ol className="flex flex-wrap items-center gap-1 text-sm text-slate-500">
          <li>
            <Link to="/catalog" className="hover:text-indigo-700">
              Catalog
            </Link>
          </li>
          <ChevronRight size={14} aria-hidden="true" />
          <li>
            <Link to="/catalog" className="hover:text-indigo-700">
              {PRODUCT.category}
            </Link>
          </li>
          <ChevronRight size={14} aria-hidden="true" />
          <li aria-current="page" className="font-semibold text-slate-800">
            {PRODUCT.name}
          </li>
        </ol>
      </nav>

      <div className="grid gap-10 lg:grid-cols-[minmax(0,1.45fr)_minmax(0,1fr)]">
        {/* ------------------------- GALERÍA ------------------------- */}
        <section aria-label="Galería de imágenes">
          <div className="aspect-[9/8] overflow-hidden rounded-2xl border border-slate-200 bg-slate-200">
            <img
              src={PRODUCT.images[activeImage]}
              alt={`${PRODUCT.name} - imagen ${activeImage + 1}`}
              className="h-full w-full object-cover"
            />
          </div>

          <div className="mt-5 flex gap-4">
            {PRODUCT.images.map((src, index) => (
              <button
                key={src}
                type="button"
                onClick={() => setActiveImage(index)}
                aria-label={`Ver imagen ${index + 1}`}
                aria-pressed={activeImage === index}
                className={`h-24 w-24 overflow-hidden rounded-lg border-2 bg-slate-200 transition md:h-28 md:w-28 ${
                  activeImage === index
                    ? "border-indigo-600 ring-2 ring-indigo-600/20"
                    : "border-slate-200 opacity-90 hover:border-slate-400 hover:opacity-100"
                }`}
              >
                <img src={src} alt="" className="h-full w-full object-cover" />
              </button>
            ))}
          </div>
        </section>

        {/* ------------------------- INFORMACIÓN ------------------------- */}
        <section aria-label="Información del producto">
          {/* Título + favorito */}
          <div className="flex items-start justify-between gap-4">
            <h1 className="text-4xl font-extrabold leading-tight tracking-tight text-slate-900 xl:text-6xl">
              {PRODUCT.name}
            </h1>
            <button
              type="button"
              onClick={() => setIsFavorite((v) => !v)}
              aria-label={isFavorite ? "Quitar de favoritos" : "Agregar a favoritos"}
              aria-pressed={isFavorite}
              className="mt-2 shrink-0 text-slate-700 hover:text-rose-600"
            >
              <Heart
                size={30}
                strokeWidth={1.5}
                className={isFavorite ? "fill-rose-600 text-rose-600" : ""}
              />
            </button>
          </div>

          {/* Valoración + categoría */}
          <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1">
            <StarRating rating={PRODUCT.rating} />
            <span className="text-slate-600">({PRODUCT.reviews} Reviews)</span>
            <span className="h-1.5 w-1.5 rounded-full bg-slate-300" aria-hidden="true" />
            <Link
              to="/catalog"
              className="font-bold text-sky-800 hover:underline"
            >
              {PRODUCT.category}
            </Link>
          </div>

          {/* Descripción */}
          <p className="mt-6 text-lg leading-relaxed text-slate-600">
            {PRODUCT.description}
          </p>

          {/* Tarjeta de compra */}
          <div className="mt-8 rounded-2xl border border-indigo-100 bg-indigo-50/60 p-6 sm:p-8">
            {/* Precio + cantidad */}
            <div className="flex items-end justify-between gap-4">
              <div>
                <p className="font-mono text-sm uppercase tracking-widest text-slate-600">
                  Price
                </p>
                <p className="text-5xl font-extrabold tracking-tight text-indigo-700">
                  {money(PRODUCT.price)}
                </p>
              </div>

              <div className="flex items-center gap-1 rounded-full border border-slate-200 bg-white p-1.5 shadow-sm">
                <button
                  type="button"
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  disabled={quantity <= 1}
                  aria-label="Disminuir cantidad"
                  className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-800 hover:bg-slate-100 disabled:opacity-40"
                >
                  <Minus size={18} />
                </button>
                <span
                  className="w-8 text-center font-medium text-slate-900"
                  aria-live="polite"
                >
                  {quantity}
                </span>
                <button
                  type="button"
                  onClick={() => setQuantity((q) => Math.min(MAX_QUANTITY, q + 1))}
                  disabled={quantity >= MAX_QUANTITY}
                  aria-label="Aumentar cantidad"
                  className="flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 disabled:opacity-40"
                >
                  <Plus size={18} />
                </button>
              </div>
            </div>

            {/* Extra toppings */}
            <fieldset className="mt-8">
              <legend className="mb-3 font-mono text-sm font-semibold uppercase tracking-widest text-slate-800">
                Add extra toppings
              </legend>
              <div className="space-y-3">
                {TOPPINGS.map((topping) => (
                  <label
                    key={topping.id}
                    className="flex cursor-pointer items-center justify-between rounded-lg border border-slate-200 bg-white px-4 py-3.5 hover:border-indigo-300"
                  >
                    <span className="flex items-center gap-3 text-slate-900">
                      <input
                        type="checkbox"
                        checked={selectedToppings.includes(topping.id)}
                        onChange={() => toggleTopping(topping.id)}
                        className="h-5 w-5 rounded border-slate-300 accent-indigo-600"
                      />
                      {topping.name}
                    </span>
                    <span className="font-medium text-sky-800">
                      +{money(topping.price)}
                    </span>
                  </label>
                ))}
              </div>
            </fieldset>

            {/* Side */}
            <div className="mt-8">
              <label
                htmlFor="side"
                className="mb-3 block font-mono text-sm font-semibold uppercase tracking-widest text-slate-800"
              >
                Choose a side
              </label>
              <div className="relative">
                <select
                  id="side"
                  value={sideId}
                  onChange={(e) => setSideId(e.target.value)}
                  className="w-full appearance-none rounded-lg border border-slate-200 bg-white px-4 py-4 pr-10 text-slate-900 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/30"
                >
                  {SIDES.map((side) => (
                    <option key={side.id} value={side.id}>
                      {side.name}{" "}
                      {side.extra === 0 ? "(Included)" : `(+${money(side.extra)})`}
                    </option>
                  ))}
                </select>
                <ChevronDown
                  size={18}
                  aria-hidden="true"
                  className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-slate-600"
                />
              </div>
            </div>

            {/* Botón de acción */}
            <button
              type="button"
              onClick={handleAddToCart}
              className="mt-10 flex w-full items-center justify-center gap-3 rounded-xl bg-indigo-600 px-6 py-5 text-lg font-semibold text-white shadow-lg shadow-indigo-600/25 transition hover:bg-indigo-700 active:scale-[0.99]"
            >
              <ShoppingBasket size={26} />
              Add to Cart — {money(total)}
            </button>
          </div>
        </section>
      </div>

      {/* ------------------------- INFORMACIÓN LOGÍSTICA ------------------------- */}
      <section
        aria-label="Información de entrega"
        className="mt-12 grid gap-4 border-t border-slate-200 pt-8 sm:grid-cols-3"
      >
        {LOGISTICS.map(({ icon: Icon, title, text }) => (
          <div
            key={title}
            className="flex items-start gap-4 rounded-xl border border-slate-200 bg-white p-5"
          >
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-indigo-50 text-indigo-700">
              <Icon size={22} />
            </span>
            <div>
              <h3 className="font-bold text-slate-900">{title}</h3>
              <p className="mt-1 text-sm text-slate-600">{text}</p>
            </div>
          </div>
        ))}
      </section>
    </div>
  );
};
