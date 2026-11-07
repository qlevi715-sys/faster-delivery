import React, { useCallback, useEffect, useState } from "react"
import { useAuth } from "../context/useAuth"
import { createProduct, getProductsByCategoryId } from "../service/product-services"
import type { ProductPayload, ProductResponse } from "../models/product"
import type { CategoryResponse } from "../models/category"
import { getCategories } from "../service/category-service"
import { toast } from "sonner"


export interface ProductFormState {
    name: string
    categoryId: string | number
    sku: string
    description: string
    regularPrice: string
    offerPrice: string
    initialStock: string
    minStockAlert: string
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
}

export function useProductViewModel(categoryId: number | string | null) {
    const { token } = useAuth()
    const [form, setForm] = useState(initialFormState)
    const [error, setError] = useState("")
    const [success, setSuccess] = useState("")
    const [isLoading, setIsLoading] = useState(false)
    const [isLoadingCategories, setIsLoadingCategories] = useState(false)
    const [categories, setCategories] = useState<CategoryResponse[]>([])
    const [products, setProducts] = useState<ProductResponse[]>([]);

    const fetchProducts = useCallback(async () => {
        if (!categoryId) {
            return;
        }

        try {
            setIsLoading(true);
            setError("");
            const data = await getProductsByCategoryId(categoryId, token);
            setProducts(data);
        } catch (error) {
            setError(error instanceof Error ? error.message : "Error al cargar los productos");
        } finally {
            setIsLoading(false);
        }
    }, [categoryId, token]);

    useEffect(() => {
        fetchProducts()
    }, [fetchProducts])

    useEffect(() => {
        async function fetchCategories() {
            try {
                setIsLoadingCategories(true)
                const data = await getCategories(token)
                setCategories(data)
            } catch (error) {
                setError(error instanceof Error ? error.message : "Error al cargar categorias")
            } finally {
                setIsLoadingCategories(false)
            }
        }

        fetchCategories()
    }, [token])

    const handleChange = (field: keyof ProductFormState, value: string) => {
        setForm(prev => ({ ...prev, [field]: value }))
    }

    const submit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!form.name.trim()) {
            const message = "El nombre del producto es obligatorio"
            setError(message)
            toast.error(message)
            return
        }

        //PARSEAR ALGUNOS DATOS DE PRECIOS Y STOCK
        const regularPrice = parseFloat(form.regularPrice)
        const offerPrice = parseFloat(form.offerPrice)
        const initialStock = parseInt(form.initialStock, 10)
        const minStockAlert = parseInt(form.minStockAlert, 10)

        if (offerPrice > regularPrice) {
            const message = "El precio de oferta no puede ser mayor al precio regular"
            setError(message)
            toast.error(message)
            return
        }

        const payload: ProductPayload = {
            name: form.name.trim(),
            categoryId: Number(form.categoryId),
            sku: form.sku.trim(),
            description: form.description.trim(),
            regularPrice: isNaN(regularPrice) ? 0 : regularPrice,
            offerPrice: isNaN(offerPrice) ? 0 : offerPrice,
            initialStock: isNaN(initialStock) ? 0 : initialStock,
            minStockAlert: isNaN(minStockAlert) ? 0 : minStockAlert
        }

        try {
            setIsLoading(true)
            setError("")
            setSuccess("")

            await createProduct(payload, token)
            setSuccess("Producto creado con exito")
            toast.success("Producto creado con éxito")
            setForm(initialFormState)
        } catch (error) {
            const message = error instanceof Error ? error.message : "No se pudo crear el producto"
            setError(message)
            toast.error(message)
        } finally {
            setIsLoading(false)
        }
    }

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
    }
}