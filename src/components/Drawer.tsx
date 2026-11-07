import { Cake, Coffee, FolderPlus, LayoutGrid, Loader2, PackagePlus, Pizza, Salad, Tag, X } from "lucide-react";
import type React from "react";
import { NavLink, useNavigate, useSearchParams } from "react-router-dom";
import { useCategoryViewModel } from "../viewmodels/use-category";

interface DrawerProps {
    isOpen: boolean
    onClose: () => void
    selectedCategoryId?: number | string | null
    onSelectCategory?: (id: number | string | null) => void
}

const getCategoryIcon = (name: string) => {
    const lower = name.toLowerCase()

    if (lower.includes("pizza") || lower.includes("fast") || lower.includes("comida")) return Pizza
    if (lower.includes("salad") || lower.includes("healthy") || lower.includes("saludable")) return Salad
    if (lower.includes("cake") || lower.includes("dessert") || lower.includes("postre") || lower.includes("dulce")) return Cake
    if (lower.includes("coffee") || lower.includes("beverage") || lower.includes("bebida")) return Coffee

    return Tag
}

const navLinkClass = ({ isActive }: { isActive: boolean }) =>
    `flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left text-sm font-semibold transition-colors ${
        isActive ? "bg-indigo-50 text-indigo-700" : "text-slate-600 hover:bg-slate-100"
    }`

const filterButtonClass = (selected: boolean) =>
    `flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm transition-colors ${
        selected ? "bg-cyan-100 font-semibold text-cyan-700" : "text-slate-600 hover:bg-slate-100"
    }`

export const Drawer: React.FC<DrawerProps> = ({
    isOpen,
    onClose,
    selectedCategoryId = null,
    onSelectCategory,
}) => {
    const navigate = useNavigate()
    const [searchParams] = useSearchParams()
    const currentCategoryId =
        searchParams.get("categoryId") ?? (selectedCategoryId != null ? String(selectedCategoryId) : null)

    // Si tu hook no devuelve `error`, quita esa propiedad y el bloque de error mas abajo.
    const { categories, isLoading, error } = useCategoryViewModel()

    const handleSelectCategory = (categoryId: number | string | null) => {
        if (categoryId == null) {
            navigate("/catalog")
        } else {
            navigate(`/catalog?categoryId=${categoryId}`)
        }
        onSelectCategory?.(categoryId)
        onClose()
    }

    return (
        <>
            {isOpen && (
                <button
                    type="button"
                    aria-label="Cerrar menu"
                    onClick={onClose}
                    className="fixed inset-0 z-30 bg-slate-900/40 md:hidden"
                />
            )}

            <aside
                className={`fixed left-0 top-0 z-40 flex h-screen w-64 flex-col border-r border-slate-200 bg-white transition-transform duration-300 md:static md:z-auto md:translate-x-0
                ${isOpen ? "translate-x-0" : "-translate-x-full"}
                `}
            >
                <div className="flex h-16 shrink-0 items-center justify-between border-b border-slate-100 px-5">
                    <div>
                        <p className="text-xs font-semibold text-slate-400">Delivery</p>
                        <h2 className="text-lg font-bold text-slate-800">Categorías</h2>
                    </div>
                    <button
                        type="button"
                        aria-label="Cerrar menu"
                        onClick={onClose}
                        className="rounded-md p-1 text-slate-500 hover:bg-slate-100 md:hidden"
                    >
                        <X size={18} />
                    </button>
                </div>

                <nav className="flex-1 space-y-6 overflow-y-auto p-4">
                    {/* Gestión: acceso a las páginas de acciones */}
                    <div>
                        <p className="mb-3 text-xs font-bold uppercase text-slate-400">Gestión</p>

                        <NavLink to="/categories/create" onClick={onClose} className={(s) => `mb-2 ${navLinkClass(s)}`}>
                            <FolderPlus size={18} />
                            Crear Categoría
                        </NavLink>

                        <NavLink to="/products/create" onClick={onClose} className={navLinkClass}>
                            <PackagePlus size={18} />
                            Crear Producto
                        </NavLink>
                    </div>

                    {/* Filtros */}
                    <div>
                        <p className="mb-3 text-xs font-bold uppercase text-slate-400">Filtros</p>
                        <ul className="space-y-1">
                            <li>
                                <button
                                    type="button"
                                    onClick={() => handleSelectCategory(null)}
                                    className={filterButtonClass(currentCategoryId === null)}
                                >
                                    <LayoutGrid size={18} />
                                    Todas las categorías
                                </button>
                            </li>

                            {isLoading && (
                                <li className="flex items-center gap-2 px-3 py-3 text-xs text-slate-400">
                                    <Loader2 className="animate-spin" size={16} />
                                    Cargando categorías...
                                </li>
                            )}

                            {error && !isLoading && (
                                <li className="px-3 py-2 text-xs text-red-500">{String(error)}</li>
                            )}

                            {!isLoading &&
                                !error &&
                                categories.map((category) => {
                                    const Icon = getCategoryIcon(category.name)
                                    const isSelected = currentCategoryId === String(category.id)

                                    return (
                                        <li key={category.id}>
                                            <button
                                                type="button"
                                                onClick={() => handleSelectCategory(category.id)}
                                                className={filterButtonClass(isSelected)}
                                            >
                                                <Icon size={18} />
                                                <span className="truncate">{category.name}</span>
                                            </button>
                                        </li>
                                    )
                                })}
                        </ul>
                    </div>
                </nav>
            </aside>
        </>
    )
}