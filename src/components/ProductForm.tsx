
import { useEffect } from "react";
import { useProductViewModel } from "../viewmodels/use-product";
import { Check } from "lucide-react";
import { toast } from "sonner";

interface ProductFormProps {
  onCancel: () => void;
  onSuccess: () => void;
}

export const ProductForm: React.FC<ProductFormProps> = ({
  onCancel,
  onSuccess
}) => {
  const {
    form,
    handleChange,
    submit,
    isLoading,
    categories,
    isLoadingCategories,
    error,
    success
  } = useProductViewModel();

  useEffect(() => {
    if (error) {
      toast.error(error);
    }
  }, [error]);

  useEffect(() => {
    if (success) {
      toast.success(success);
      onSuccess();
    }
  }, [success, onSuccess]);

  return (
    <div className="max-w-4xl rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">

      <div className="border-b border-slate-100 p-6">
        <h3 className="text-lg font-bold text-slate-800">
          Crear nuevo producto
        </h3>

        <p className="text-xs text-slate-400 mt-1">
          Ingresa los datos esenciales del producto para registrarlo en el
          catálogo
        </p>
      </div>

      <form onSubmit={submit} className="p-6 space-y-6">

        {/* Nombre del producto */}
        <div>
          <label
            htmlFor="nombre"
            className="block text-xs font-bold text-slate-700 uppercase mb-2"
          >
            Nombre del producto
          </label>

          <input
            id="nombre"
            name="name"
            type="text"
            value={form.name}
            onChange={(e) => handleChange("name", e.target.value)}
            required
            placeholder="Ej. Hamburguesa Doble Carne"
            className="w-full rounded-lg border border-slate-200 py-3 px-4 text-xs placeholder-slate-400 focus:border-indigo-600 focus:outline-none"
          />
        </div>

        {/* Categoría */}
        <div>
          <label
            htmlFor="categoria"
            className="block text-xs font-bold text-slate-700 uppercase mb-2"
          >
            Categoría
          </label>

          <select
            id="categoria"
            name="categoryId"
            required
            disabled={isLoadingCategories}
            value={form.categoryId}
            onChange={(e) => handleChange("categoryId", e.target.value)}
            className="w-full rounded-lg border border-slate-200 py-3 px-4 text-xs text-slate-700 focus:border-indigo-600 focus:outline-none"
          >
            <option value="">
              {isLoadingCategories
                ? "Cargando categorías..."
                : "Selecciona la categoría"}
            </option>

            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>

        {/* Código de barras */}
        <div>
          <label
            htmlFor="codigo-barra"
            className="block text-xs font-bold text-slate-700 uppercase mb-2"
          >
            Código de barras
          </label>

          <input
            id="codigo-barra"
            name="sku"
            type="text"
            inputMode="numeric"
            required
            value={form.sku}
            onChange={(e) => handleChange("sku", e.target.value)}
            placeholder="Ej. 750564654654654"
            className="w-full rounded-lg border border-slate-200 py-3 px-4 text-xs placeholder-slate-400 focus:border-indigo-600 focus:outline-none"
          />

          <span className="text-[10px] text-slate-400 block mt-1">
            Código interno de inventario. Ingresa únicamente números.
          </span>
        </div>

        {/* Descripción */}
        <div>
          <label
            htmlFor="descripcion"
            className="block text-xs font-bold text-slate-700 uppercase mb-2"
          >
            Descripción detallada
          </label>

          <textarea
            id="descripcion"
            name="description"
            required
            value={form.description}
            onChange={(e) => handleChange("description", e.target.value)}
            placeholder="Describe la presentación y notas de preparación"
            className="w-full h-32 rounded-lg border border-slate-200 py-3 px-4 text-xs placeholder-slate-400 focus:border-indigo-600 focus:outline-none"
          />

          <span className="text-[10px] text-slate-400 block mt-1">
            Asegúrate de incluir advertencias o especificaciones de porciones
            para los repartidores.
          </span>
        </div>

        {/* Precios y existencias */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">

          {/* Precio regular */}
          <div>
            <label
              htmlFor="precio-regular"
              className="block text-xs font-bold text-slate-700 uppercase mb-2"
            >
              Precio regular
            </label>

            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm text-slate-700">
                $
              </span>

              <input
                id="precio-regular"
                name="regularPrice"
                type="number"
                value={form.regularPrice}
                onChange={(e) => handleChange("regularPrice", e.target.value)}
                step="0.01"
                min="0.01"
                required
                placeholder="0.00"
                className="w-full border border-slate-200 py-3 pl-8 pr-4 text-xs text-slate-700 focus:border-indigo-600 focus:outline-none"
              />
            </div>
          </div>

          {/* Precio de oferta */}
          <div>
            <label
              htmlFor="precio-oferta"
              className="block text-xs font-bold text-slate-700 uppercase mb-2"
            >
              Precio de oferta
            </label>

            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm text-slate-700">
                $
              </span>

              <input
                id="precio-oferta"
                name="offerPrice"
                type="number"
                value={form.offerPrice}
                onChange={(e) => handleChange("offerPrice", e.target.value)}
                step="0.01"
                min="0"
                required
                placeholder="0.00"
                className="w-full border border-slate-200 py-3 pl-8 pr-4 text-xs text-slate-700 focus:border-indigo-600 focus:outline-none"
              />
            </div>
          </div>

          {/* Stock inicial */}
          <div>
            <label
              htmlFor="stock-inicial"
              className="block text-xs font-bold text-slate-700 uppercase mb-2"
            >
              Stock inicial
            </label>

            <input
              id="stock-inicial"
              name="initialStock"
              type="number"
              step="1"
              min="0"
              value={form.initialStock}
              onChange={(e) => handleChange("initialStock", e.target.value)}
              required
              placeholder="0"
              className="w-full border border-slate-200 rounded-lg py-3 px-4 text-xs text-slate-700 focus:border-indigo-600 focus:outline-none"
            />
          </div>

          {/* Stock mínimo */}
          <div>
            <label
              htmlFor="stock-minimo"
              className="block text-xs font-bold text-slate-700 uppercase mb-2"
            >
              Stock mínimo
            </label>

            <input
              id="stock-minimo"
              name="minStockAlert"
              type="number"
              step="1"
              min="0"
              value={form.minStockAlert}
              onChange={(e) => handleChange("minStockAlert", e.target.value)}
              required
              placeholder="0"
              className="w-full border border-slate-200 rounded-lg py-3 px-4 text-xs text-slate-700 focus:border-indigo-600 focus:outline-none"
            />
          </div>

        </div>

        {/* Botones */}
        <div className="flex items-center justify-end gap-3 border-t border-slate-100 pt-5">

          <button
            type="button"
            onClick={onCancel}
            disabled={isLoading}
            className="rounded-lg bg-slate-100 hover:bg-slate-200 px-5 py-2 text-xs font-semibold text-slate-600 disabled:opacity-50"
          >
            Cancelar
          </button>

          <button
            type="submit"
            disabled={isLoading || isLoadingCategories}
            className="flex items-center gap-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 px-5 py-2 text-xs font-semibold text-white disabled:opacity-50"
          >
            <Check size={16} />

            {isLoading ? "Creando..." : "Crear producto"}
          </button>

        </div>
      </form>
    </div>
  );
};
