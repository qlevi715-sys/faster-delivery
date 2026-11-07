import { useState, type FormEvent } from "react";
import type { RegisterPayload } from "../models/register";
import { registerUser } from "../service/register-service";

const initialForm: RegisterPayload = {
    name: "",
    lastname: "",
    phone: "",
    email: "",
    password: ""
}

export function useRegisterViewModel(){

    const [form, setForm] = useState<RegisterPayload>(initialForm)
    const [confirmPassword, setConfirmPassword] = useState("")
    const [error, setError] = useState("")
    const [isLoading, setIsLoading] = useState(false)
    const [success, setSuccess] = useState("")

    const handleChange =(field:keyof RegisterPayload,value:string)=>{
        setForm((prev)=>({
            ...prev,
            [field]:value
        }))

        console.log(form);

    }

    const validate=()=>{
        console.log(form);

        if(!form.name || !form.lastname || !form.phone || !form.email || !confirmPassword){
            return "Completa todos los campos"
        }

        if(form.password.length <6){
            return "La contraseña debe tener al menos 6 caracteres"
        }

        if(form.password !== confirmPassword){
            return "Las contraseñas no coinciden"
        }

        return ""
    }

    const submit = async(e:FormEvent<HTMLFormElement>)=>{
        e.preventDefault()
        setSuccess("")
        setError("")

        const validationMessage= validate()
        if(validationMessage){
            setError(validationMessage)
            return
        }

        setIsLoading(true)

        try {
            const response = await registerUser(form)
            console.log("REGISTER RESPONSE",response)
            setSuccess("Usuario registrado correctamente")
            setForm(initialForm)
            setConfirmPassword("")
        } catch (error) {
            console.log(error);
            setError(error instanceof Error ? error.message : "Error al registrar usuario")
            if (error instanceof Error) {
        console.log("Mensaje del backend:", error.message)
    }

        } finally{
            setIsLoading(false)
        }
    }

    return{
        form,
        confirmPassword,
        setConfirmPassword,
        isLoading,
        error,
        handleChange,
        success,
        submit
    }
 

}