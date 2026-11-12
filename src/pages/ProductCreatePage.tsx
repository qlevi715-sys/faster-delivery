import type React from "react";
import { useNavigate } from "react-router-dom";
import { ProductForm } from "../components/ProductForm";

export const ProductCreatePage: React.FC = () => {
  const navigate = useNavigate();

  // La alerta de éxito la lanza el propio formulario al guardar (así no sale duplicada).
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-slate-800">Gestion de Productos</h2>
        <p className="mt-1 text-sm text-slate-500">Crea y administra los productos para tus clientes</p>
      </div>

      <ProductForm onCancel={() => navigate("/catalog")} />
    </div>
  );
};
