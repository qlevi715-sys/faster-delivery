import { API_BASE_URL } from "../api/apiBase";
import type { LoginPayload, LoginResponse, UserRequest } from "../models/user";

export async function loginUser(payload:LoginPayload):Promise<LoginResponse> {
    const response = await fetch(`${API_BASE_URL}/auth/login`,{
        method:"POST",
        headers:{"Content-Type":"application/json"},
        body:JSON.stringify(payload)
    })

    if(!response.ok){
        let message="Error al iniciar sesion"
        try {
            const err= await response.json()
            message = err?.message ?? message
        } catch (error) {
            console.log("Error",error);
        }
        throw new Error(message)
    }
    return response.json()
}

export async function updateUserProfile(
    userId: number,
    payload: UserRequest,
    token: string | null
) {
    console.log("TOKEN", token);
    const formData = new FormData();
    formData.append("name", payload.name);
    formData.append("lastname", payload.lastname);
    formData.append("phone", payload.phone);
  const headerToken = token?.startsWith("Bearer" )? token : `Bearer ${token}`
  const response = await fetch(`${API_BASE_URL}/users/upload/${userId}`, {
        method: "PUT",
        headers: {
        Authorization:headerToken
        },
        body: formData
    });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || "Error al actualizar usuario");
  }

  return response.json();
}

export async function validateToken(token:string | null):Promise<boolean>{
    if(!token) return false

    const headerToken = token?.startsWith("Bearer ") ? token : `Bearer ${token}`
    try {
        const response = await fetch(`${API_BASE_URL}/auth/validate`,{
            method:"GET",
            headers:{
                "Content-Type":"application/json",
                Authorization:headerToken
            }
        })
        if(!response.ok){
            return false
        }
        const data = await response.json()
        return Boolean(data?.valid)
    } catch (error) {
        console.log("Error validando token:", error);
        return false
    }
}