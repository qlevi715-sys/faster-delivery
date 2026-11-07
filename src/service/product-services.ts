import { API_BASE_URL } from "../api/apiBase";
import type { ProductPayload, ProductResponse } from "../models/product";

export async function createProduct(
    payload:ProductPayload,
    token:string | null
){
    const headers: Record<string, string> = {
        "Content-Type": "application/json"
    }

    if (token) {
        headers["Authorization"] = token.startsWith("Bearer ") ? token : `Bearer ${token}`;
    }

    const response = await fetch(`${API_BASE_URL}/products/create`, {
        method:"POST",
        headers,
        body: JSON.stringify(payload)
    })
    console.log(response);

    if (!response.ok) {
        let message = "Error al crear el producto";
        try {
            const err = await response.json()
            message = err?.message ?? message
        } catch (error) {
            console.log("Error", error);
        }
        throw new Error(message)
    }
    return response.json()
}

export async function getProducts(
    token: string | null
): Promise<ProductResponse[]> {

    const headers: Record<string, string> = {
        "Content-Type": "application/json"
    }

    if (token) {
        headers["Authorization"] = token.startsWith("Bearer ") ? token : `Bearer ${token}`;
    }

    // OJO: confirma esta ruta con el backend (/products, /products/all, /products/list...)
    const response = await fetch(`${API_BASE_URL}/products`, {
        method: "GET",
        headers: headers
    });

    if (!response.ok) {
        let message = "Error al traer los productos";
        try {
            const err: { message?: string } = await response.json();
            message = err.message ?? message;
        } catch (error) {
            console.log("Error", error);
        }

        throw new Error(message);
    }

    return response.json();
}

export async function getProductsByCategoryId(
    categoryId: number | string,
    token: string | null
): Promise<ProductResponse[]> {
    
    const headers: Record<string, string> = {
        "Content-Type": "application/json"
    }

    if (token) {
        headers["Authorization"] = token.startsWith("Bearer ") ? token : `Bearer ${token}`;
    }

    const response = await fetch(`${API_BASE_URL}/products/category/${categoryId}`, {
        method: "GET",
        headers: headers
    });

    if (!response.ok) {
        let message = "Error al traer los productos";
        try {
            const err: { message?: string } = await response.json();
            message = err.message ?? message;
        } catch (error) {
            console.log("Error", error);
        }
        
        throw new Error(message);
    }

    return response.json();
}