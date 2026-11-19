import { Heart, ShoppingCart } from "lucide-react";
import { Link } from "react-router-dom";
import type { ProductResponse } from "../models/product";

interface ProductCardProps {
    product: ProductResponse
}

export const ProductCard = ({product}: ProductCardProps) => {
    return (
        <article className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
            <div className="relative">
                <img
                    src={product.imageUrl}
                    alt={product.name}
                    className="h-32 w-full object-cover"
                />
            </div>

            <div className="p-3">
                <div className="flex items-start justify-between gap-2">
                    <h3 className="text-sm font-bold text-slate-800">
                        <Link to={`/products/${product.id}`} className="hover:text-indigo-700 hover:underline">
                            {product.name}
                        </Link>
                    </h3>
                    <span className="whitespace-nowrap text-sm font-bold"> ${product.regularPrice.toFixed(2)}</span>
                </div>

                <p className="mt-2 h-10 overflow-hidden text-xs">
                    {product.description}
                </p>

                <div className="mt-4 flex gap-2">
                    <button
                        type="button"
                        className="flex flex-1 items-center justify-center gap-2 rounded bg-indigo-600 px-2 py-2 text-xs font-bold text-white hover:bg-indigo-700"
                    >
                        <ShoppingCart size={14}/>
                        Add to cart
                    </button>
                    <button
                        type="button"
                        className="rounded border border-slate-300 px-3 text-slate-500 hover:bg-slate-100"
                    >
                        <Heart size={14}/>
                    </button>
                </div>
            </div>
        </article>
    )
}