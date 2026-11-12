import React, { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import { useAuth } from "../context/useAuth";
import {
  createProduct,
  getProductsByCategoryId
} from "../service/product-services";
import type {
  ProductPayload,
  ProductResponse
} from "../models/product";
import type { CategoryResponse } from "../models/category";
import { getCategories } from "../service/category-service";
import { useFieldErrors } from "./use-field-errors";
import {
  PRODUCT_NAME_MAX_LENGTH,
  SKU_MAX_LENGTH,
  STOCK_MAX_LENGTH,
  compactErrors,
  sanitizeInput,
  summarizeErrors,
  validatePrice,
  validateProductName,
  validateRequiredText,
  validateSku,
  validateWholeNumber
} from "../utils/form-validation";

export interface ProductFormState {
  name: string;
  categoryId: string | number;
  sku: string;
  description: string;
  regularPrice: string;
  offerPrice: string;
  initialStock: string;
  minStockAlert: string;
}

const initialFormState: ProductFormState = {
  name: "",
  categoryId: "",
  sku: "",
  description: "",
  regularPrice: "",
  offerPrice: "",
  initialStock: "",
  minStockAlert: ""
};

const SUBJECTS = {
  name: "El nombre del producto",
  sku: "El código de barras",
  description: "La descripción",
  regularPrice: "El precio regular",
  offerPrice: "El precio de oferta",
  initialStock: "El stock inicial",
  minStockAlert: "El stock mínimo"
};

// Bloquea los caracteres no permitidos según el campo y devuelve el mensaje si hubo rechazo.
const filterField = (field: keyof ProductFormState, raw: string) => {
  switch (field) {
    case "name":
      return sanitizeInput("text", raw, SUBJECTS.name, PRODUCT_NAME_MAX_LENGTH);

    case "sku":
      return sanitizeInput("digits", raw, SUBJECTS.sku, SKU_MAX_LENGTH);

    case "regularPrice":
    case "offerPrice":
      return sanitizeInput("decimal", raw, SUBJECTS[field]);

    case "initialStock":
    case "minStockAlert":
      return sanitizeInput("digits", raw, SUBJECTS[field], STOCK_MAX_LENGTH);

    default:
      return { value: raw, error: "" };
  }
};

export function useProductViewModel(
  categoryId: number | string | null = null,
  onSuccessCallback?: () => void
) {
  const { token } = useAuth();

  const [form, setForm] = useState(initialFormState);
  // Solo errores al CARGAR productos/categorías (los de enviar el formulario salen como toast).
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingCategories, setIsLoadingCategories] = useState(false);
  const [categories, setCategories] = useState<CategoryResponse[]>([]);
  const [products, setProducts] = useState<ProductResponse[]>([]);
  const { fieldErrors, reportInputError, replaceFieldErrors } =
    useFieldErrors<keyof ProductFormState>();

  const fetchProducts = useCallback(async () => {
    if (!categoryId) return;

    try {
      const data = await getProductsByCategoryId(categoryId, token);
      setProducts(data);
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Error al cargar los productos"
      );
    }
  }, [categoryId, token]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  useEffect(() => {
    async function fetchCategories() {
      try {
        setIsLoadingCategories(true);
        const data = await getCategories(token);
        setCategories(data);
      } catch (error) {
        setError(
          error instanceof Error
            ? error.message
            : "Error al cargar las categorías"
        );
      } finally {
        setIsLoadingCategories(false);
      }
    }

    fetchCategories();
  }, [token]);

  const handleChange = (
    field: keyof ProductFormState,
    raw: string
  ) => {
    const { value, error } = filterField(field, raw);

    reportInputError(field, error);
    setForm((prev) => ({
      ...prev,
      [field]: value
    }));
  };

  const validate = () => {
    const regularPriceError = validatePrice(
      form.regularPrice,
      SUBJECTS.regularPrice
    );

    let offerPriceError = validatePrice(
      form.offerPrice,
      SUBJECTS.offerPrice,
      { allowZero: true }
    );

    if (
      !regularPriceError &&
      !offerPriceError &&
      Number(form.offerPrice) > Number(form.regularPrice)
    ) {
      offerPriceError =
        "El precio de oferta no puede ser mayor al precio regular.";
    }

    return compactErrors<keyof ProductFormState>({
      name: validateProductName(form.name, SUBJECTS.name),
      categoryId: form.categoryId ? "" : "Selecciona una categoría.",
      sku: validateSku(form.sku, SUBJECTS.sku),
      description: validateRequiredText(form.description, SUBJECTS.description),
      regularPrice: regularPriceError,
      offerPrice: offerPriceError,
      initialStock: validateWholeNumber(form.initialStock, SUBJECTS.initialStock),
      minStockAlert: validateWholeNumber(form.minStockAlert, SUBJECTS.minStockAlert)
    });
  };

  const submit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const errors = validate();
    replaceFieldErrors(errors);

    const summary = summarizeErrors(errors);

    if (summary) {
      toast.error(summary);
      return;
    }

    const payload: ProductPayload = {
      name: form.name.trim(),
      categoryId: Number(form.categoryId),
      sku: form.sku.trim(),
      description: form.description.trim(),
      regularPrice: Number(form.regularPrice),
      offerPrice: Number(form.offerPrice),
      initialStock: Number(form.initialStock),
      minStockAlert: Number(form.minStockAlert)
    };

    try {
      setIsLoading(true);

      await createProduct(payload, token);

      toast.success("Producto creado con éxito");
      setForm(initialFormState);

      await fetchProducts();
      onSuccessCallback?.();
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "No se pudo crear el producto"
      );
    } finally {
      setIsLoading(false);
    }
  };

  return {
    form,
    handleChange,
    submit,
    isLoading,
    error,
    fieldErrors,
    categories,
    isLoadingCategories,
    products
  };
}
