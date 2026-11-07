import { useContext } from "react"
import { AuthContext } from "./AuthContext"

// Esta función debe estar utilizando en todos los componentes donde quiera utilizar la información global
// Toggle usado si...

export function useAuth() {
    const context = useContext(AuthContext)

    if (!context) throw new Error("useAuth debe usarse dentro de AuthProvider")

    return context
}