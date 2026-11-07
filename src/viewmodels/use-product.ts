import React, { useCallback, useEffect, useState } from "react";
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
import {
  onlyDecimal,
  onlyNumbers,
  isValidDecimal,
  isValidInteger
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

export function useProductViewModel(
  categoryId: number | string | null = null
) {
  const { token } = useAuth();

  const [form, setForm] = useState(initialFormState);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingCategories, setIsLoadingCategories] = useState(false);
  const [categories, setCategories] = useState<CategoryResponse[]>([]);
  const [products, setProducts] = useState<ProductResponse[]>([]);

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
    value: string
  ) => {
    setError("");

    if (field === "regularPrice" || field === "offerPrice") {
      value = onlyDecimal(value);
    }

    if (field === "initialStock" || field === "minStockAlert") {
      value = onlyNumbers(value);
    }

    setForm((prev) => ({
      ...prev,
      [field]: value
    }));
  };

  const submit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (
      !form.name.trim() ||
      !form.categoryId ||
      !form.sku.trim() ||
      !form.description.trim() ||
      !form.regularPrice ||
      !form.offerPrice ||
      !form.initialStock ||
      !form.minStockAlert
    ) {
      setError("Completa todos los campos");
      return;
    }

    if (!isValidDecimal(form.regularPrice) ||
        !isValidDecimal(form.offerPrice)) {
      setError("Los precios deben ser números válidos con máximo dos decimales");
      return;
    }

    if (!isValidInteger(form.initialStock) ||
        !isValidInteger(form.minStockAlert)) {
      setError("Las existencias deben ser números enteros");
      return;
    }

    const regularPrice = Number(form.regularPrice);
    const offerPrice = Number(form.offerPrice);
    const initialStock = Number(form.initialStock);
    const minStockAlert = Number(form.minStockAlert);

    if (regularPrice <= 0) {
      setError("El precio regular debe ser mayor que cero");
      return;
    }

    if (offerPrice > regularPrice) {
      setError("El precio de oferta no puede ser mayor al precio regular");
      return;
    }

    if (initialStock < 0 || minStockAlert < 0) {
      setError("Las existencias no pueden ser negativas");
      return;
    }

    const payload: ProductPayload = {
      name: form.name.trim(),
      categoryId: Number(form.categoryId),
      sku: form.sku.trim(),
      description: form.description.trim(),
      regularPrice,
      offerPrice,
      initialStock,
      minStockAlert
    };

    try {
      setIsLoading(true);

      await createProduct(payload, token);

      setSuccess("Producto creado con éxito");
      setForm(initialFormState);

      await fetchProducts();
    } catch (error) {
      setError(
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
    success,
    categories,
    isLoadingCategories,
    products
  };
}