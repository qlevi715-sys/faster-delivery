import { useState } from "react";
import type React from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Lock, Minus, Plus, ShoppingCart, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { INITIAL_CART_ITEMS } from "../data/cart";
import type { CartItem } from "../data/cart";

const MAX_QUANTITY = 10;
const TAX_RATE = 0.08;
const DELIVERY_FEE = 0; // Free

const money = (value: number) => `$${value.toFixed(2)}`;

export const CartPage: React.FC = () => {
  const [items, setItems] = useState<CartItem[]>(INITIAL_CART_ITEMS);
  const [promoCode, setPromoCode] = useState("");

  const changeQuantity = (id: number, delta: number) => {
    setItems((current) =>
      current.map((item) =>
        item.id === id
          ? { ...item, quantity: Math.min(MAX_QUANTITY, Math.max(1, item.quantity + delta)) }
          : item
      )
    );
  };

  const removeItem = (id: number) => {
    setItems((current) => current.filter((item) => item.id !== id));
    toast.success("Producto eliminado del carrito");
  };

  const handleApplyPromo = () => {
    if (!promoCode.trim()) {
      toast.error("Ingresa un código promocional");
      return;
    }
    toast.info("Los códigos promocionales estarán disponibles pronto");
  };

  const handleCheckout = () => {
    toast.info("El checkout estará disponible pronto");
  };

  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  // Se redondea hacia arriba al centavo
  const tax = Math.ceil(subtotal * TAX_RATE * 100) / 100;
  const total = items.length > 0 ? subtotal + DELIVERY_FEE + tax : 0;

  return (
    <div className="mx-auto max-w-7xl">
      <h1 className="mb-8 text-4xl font-extrabold tracking-tight text-slate-900">
        Your Shopping Cart
      </h1>

      {items.length === 0 ? (
        <div className="flex flex-col items-center rounded-xl border border-slate-200 bg-white px-6 py-20 text-center">
          <span className="flex h-16 w-16 items-center justify-center rounded-full bg-indigo-50 text-indigo-700">
            <ShoppingCart size={30} />
          </span>
          <h2 className="mt-5 text-xl font-bold text-slate-900">Your cart is empty</h2>
          <p className="mt-1 text-sm text-slate-600">
            Agrega productos del catálogo para verlos aquí.
          </p>
          <Link
            to="/catalog"
            className="mt-6 rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700"
          >
            Ver catálogo
          </Link>
        </div>
      ) : (
        <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_380px]">
          {/* ------------------------- ITEMS ------------------------- */}
          <section aria-label="Productos en el carrito" className="space-y-4">
            {items.map((item) => (
              <article
                key={item.id}
                className="flex gap-4 rounded-xl border border-slate-200 bg-white p-4"
              >
                <img
                  src={item.image}
                  alt={item.name}
                  className="h-24 w-24 shrink-0 rounded-lg bg-slate-200 object-cover"
                />

                <div className="flex min-w-0 flex-1 flex-col justify-between">
                  <div className="flex items-start justify-between gap-4">
                    <div className="min-w-0">
                      <h2 className="text-lg font-semibold text-slate-900">{item.name}</h2>
                      <p className="mt-1 text-sm text-slate-600">{item.description}</p>
                    </div>
                    <p className="shrink-0 text-lg font-bold text-indigo-700">
                      {money(item.price)}
                    </p>
                  </div>

                  <div className="mt-3 flex items-center justify-between">
                    <div className="flex items-center rounded-lg border border-indigo-100 bg-indigo-50 p-1">
                      <button
                        type="button"
                        onClick={() => changeQuantity(item.id, -1)}
                        disabled={item.quantity <= 1}
                        aria-label={`Disminuir cantidad de ${item.name}`}
                        className="flex h-7 w-7 items-center justify-center rounded text-slate-800 hover:bg-white disabled:opacity-40"
                      >
                        <Minus size={16} />
                      </button>
                      <span
                        className="w-9 text-center text-sm font-medium text-slate-900"
                        aria-live="polite"
                      >
                        {item.quantity}
                      </span>
                      <button
                        type="button"
                        onClick={() => changeQuantity(item.id, 1)}
                        disabled={item.quantity >= MAX_QUANTITY}
                        aria-label={`Aumentar cantidad de ${item.name}`}
                        className="flex h-7 w-7 items-center justify-center rounded text-slate-800 hover:bg-white disabled:opacity-40"
                      >
                        <Plus size={16} />
                      </button>
                    </div>

                    <button
                      type="button"
                      onClick={() => removeItem(item.id)}
                      className="flex items-center gap-1.5 text-sm font-semibold text-red-700 hover:text-red-900"
                    >
                      <Trash2 size={16} />
                      Remove
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </section>

          {/* ------------------------- RESUMEN ------------------------- */}
          <aside
            aria-label="Resumen de la orden"
            className="rounded-xl border border-slate-200 bg-white p-6 lg:sticky lg:top-6"
          >
            <h2 className="text-xl font-bold text-slate-900">Order Summary</h2>

            <dl className="mt-6 space-y-3 text-sm">
              <div className="flex justify-between">
                <dt className="text-slate-600">Subtotal</dt>
                <dd className="font-medium text-slate-900">{money(subtotal)}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-slate-600">Delivery Fee</dt>
                <dd className="font-medium text-sky-700">
                  {DELIVERY_FEE === 0 ? "Free" : money(DELIVERY_FEE)}
                </dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-slate-600">Estimated Tax</dt>
                <dd className="font-medium text-slate-900">{money(tax)}</dd>
              </div>
            </dl>

            <div className="mt-6 border-t border-slate-200 pt-6">
              <label
                htmlFor="promo"
                className="mb-2 block font-mono text-sm uppercase tracking-widest text-slate-700"
              >
                Promo Code
              </label>
              <div className="flex gap-2">
                <input
                  id="promo"
                  type="text"
                  value={promoCode}
                  onChange={(e) => setPromoCode(e.target.value)}
                  placeholder="Enter code"
                  className="min-w-0 flex-1 rounded-md border border-slate-200 bg-slate-100 px-3 py-2 text-sm text-slate-900 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/30"
                />
                <button
                  type="button"
                  onClick={handleApplyPromo}
                  className="rounded-md bg-sky-400 px-4 py-2 text-sm font-semibold text-slate-900 hover:bg-sky-500"
                >
                  Apply
                </button>
              </div>
            </div>

            <div className="mt-6 flex items-end justify-between border-t border-slate-200 pt-6">
              <span className="text-lg font-bold text-slate-900">Total</span>
              <span className="text-4xl font-extrabold tracking-tight text-indigo-700">
                {money(total)}
              </span>
            </div>

            <button
              type="button"
              onClick={handleCheckout}
              className="mt-8 flex w-full items-center justify-center gap-2 rounded-lg bg-indigo-600 px-6 py-3.5 text-sm font-semibold text-white shadow-lg shadow-indigo-600/25 transition hover:bg-indigo-700 active:scale-[0.99]"
            >
              Proceed to Checkout
              <ArrowRight size={18} />
            </button>

            <p className="mt-4 flex items-center justify-center gap-2 font-mono text-[10px] uppercase tracking-widest text-slate-500">
              <Lock size={12} aria-hidden="true" />
              Secure checkout powered by Fast Delivery
            </p>
          </aside>
        </div>
      )}
    </div>
  );
};
