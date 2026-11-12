import { useCategoryViewModel } from "../viewmodels/use-category";
import { FieldError } from "./FieldError";

interface CategoryFormProps {
  onCancel: () => void;
  onSuccess?: () => void;
}

export const CategoryForm = ({
  onCancel,
  onSuccess
}: CategoryFormProps) => {
  const {
    form,
    handleChange,
    submit,
    isLoading,
    fieldErrors
  } = useCategoryViewModel(onSuccess);

  return (
    <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden max-w-4xl">
      <div className="border-b border-slate-100 p-6">
        <h3 className="text-lg font-bold text-slate-800">
          Crear categorías
        </h3>
        <p className="text-sm text-slate-500 mt-1">
          Define los datos principales de la nueva sección
        </p>
      </div>

      <form onSubmit={submit} noValidate className="p-6 space-y-6">
        <div>
          <label
            htmlFor="nombre-categoria"
            className="block text-xs font-bold text-slate-700 uppercase mb-2"
          >
            Nombre de la categoría
          </label>

          <input
            id="nombre-categoria"
            type="text"
            required
            value={form.name}
            onChange={(e) => handleChange("name", e.target.value)}
            placeholder="Ej: Pizza Artesanales"
            aria-invalid={Boolean(fieldErrors.name)}
            aria-describedby="nombre-categoria-error"
            className="w-full rounded-lg border border-slate-200 py-3 px-4 text-xs placeholder-slate-400 focus:border-indigo-600 focus:outline-none aria-invalid:border-red-500 aria-invalid:focus:border-red-500"
          />
          <FieldError id="nombre-categoria-error" message={fieldErrors.name} />
        </div>

        <div>
          <label
            htmlFor="descripcion-categoria"
            className="block text-xs font-bold text-slate-700 uppercase mb-2"
          >
            Descripción
          </label>

          <textarea
            id="descripcion-categoria"
            required
            value={form.description}
            onChange={(e) => handleChange("description", e.target.value)}
            placeholder="Describe los productos incluidos en esta categoría"
            aria-invalid={Boolean(fieldErrors.description)}
            aria-describedby="descripcion-categoria-error"
            className="w-full h-32 rounded-lg border border-slate-200 py-3 px-4 text-xs placeholder-slate-400 focus:border-indigo-600 focus:outline-none aria-invalid:border-red-500 aria-invalid:focus:border-red-500"
          />
          <FieldError id="descripcion-categoria-error" message={fieldErrors.description} />
        </div>

        <div className="flex gap-3 justify-end border-t border-slate-100 pt-5">
          <button
            type="button"
            onClick={onCancel}
            disabled={isLoading}
            className="rounded-lg bg-slate-100 hover:bg-slate-200 px-5 py-2 text-xs font-semibold text-slate-600"
          >
            Cancelar
          </button>

          <button
            type="submit"
            disabled={isLoading}
            className="rounded-lg bg-indigo-600 hover:bg-indigo-700 px-5 py-2 text-xs font-semibold text-white disabled:opacity-50"
          >
            {isLoading ? "Creando..." : "Crear categoría"}
          </button>
        </div>
      </form>
    </div>
  );
};
