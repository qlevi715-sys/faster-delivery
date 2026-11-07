import { API_BASE_URL } from "../api/apiBase";
import type { RegisterPayload } from "../models/register";

export async function registerUser(payload:RegisterPayload){
    const response = await fetch(`${API_BASE_URL}/auth/register`,{
        method:"POST",
        headers:{
            "Content-Type":"application/json"
        },
        body:JSON.stringify(payload)
})

    if(!response.ok){
        let message= "Error al registrar Usuario"
        try {
            const err= await response.json()
            console.log("RESPUESTA DEL BACKEND:", err)
            message = err?.Message ?? message
        } catch (error) {
            console.log(error);

        }
        throw new Error(message)
    }
    return response.json()
}