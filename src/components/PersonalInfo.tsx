import { toast } from "sonner";
import type { UserResponse } from "../models/user";
import { useEffect } from "react";

interface PersonalInfoProps {
    user: UserResponse | null;
    name: string;
    lastname: string;
    phone: string | undefined;
    onChange: (
        field: "name" | "lastname" | "phone",
        value: string
    ) => void;
    onSave: () => void;
    isLoading: boolean;
    error?: string;
    success?: string;
}

export const PersonalInfo = ({
    user,
    name,
    lastname,
    phone,
    onChange,
    onSave,
    isLoading,
    error,
    success
}: PersonalInfoProps) => {

    useEffect(() => {
        if (success) {
            toast.success(success);
        }
    }, [success]);

    useEffect(() => {
        if (error) {
            toast.error(error);
        }
    }, [error]);

    return (
        <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">

            <div className="mb-6 flex flex-col gap-3 border-b border-slate-200 pb-5 sm:flex-row sm:items-center sm:justify-between">

                <div>
                    <h2 className="text-xl font-bold text-slate-800">
                        Datos Personales
                    </h2>

                    <p className="mt-1 text-sm text-slate-500">
                        Informacion obtenida de la sesion actual
                    </p>
                </div>

                <button
                    onClick={onSave}
                    disabled={isLoading}
                    className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-indigo-700"
                >
                    {isLoading ? "Guardando..." : "Guardar cambios"}
                </button>

            </div>

            <div className="flex flex-col gap-5">

                {/* NOMBRE */}
                <label
                    htmlFor="name"
                    className="flex items-center justify-between gap-4"
                >
                    <span className="text-sm font-medium text-slate-700">
                        Nombre
                    </span>

                    <input
                        id="name"
                        type="text"
                        value={name ?? ""}
                        onChange={(e) => onChange("name", e.target.value)}
                        required
                        className="w-1/2 rounded-lg border border-slate-300 bg-slate-50 px-3 py-2.5 text-slate-700 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-600"
                    />
                </label>

                {/* APELLIDO */}
                <label
                    htmlFor="lastName"
                    className="flex items-center justify-between gap-4"
                >
                    <span className="text-sm font-medium text-slate-700">
                        Apellido
                    </span>

                    <input
                        id="lastName"
                        type="text"
                        value={lastname ?? ""}
                        onChange={(e) => onChange("lastname", e.target.value)}
                        required
                        className="w-1/2 rounded-lg border border-slate-300 bg-slate-50 px-3 py-2.5 text-slate-700 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-600"
                    />
                </label>

                {/* CORREO */}
                <label
                    htmlFor="email"
                    className="flex items-center justify-between gap-4"
                >
                    <span className="text-sm font-medium text-slate-700">
                        Correo electronico
                    </span>

                    <input
                        id="email"
                        type="email"
                        value={user?.email ?? ""}
                        readOnly
                        className="w-1/2 rounded-lg border border-slate-300 bg-slate-50 px-3 py-2.5 text-slate-700"
                    />
                </label>

                {/* TELEFONO */}
                <label
                    htmlFor="phone"
                    className="flex items-center justify-between gap-4"
                >
                    <span className="text-sm font-medium text-slate-700">
                        Numero telefonico
                    </span>

                    <input
                        id="phone"
                        type="tel"
                        inputMode="numeric"
                        value={phone ?? ""}
                        onChange={(e) => onChange("phone", e.target.value)}
                        required
                        className="w-1/2 rounded-lg border border-slate-300 bg-slate-50 px-3 py-2.5 text-slate-700 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-600"
                    />
                </label>

            </div>
        </section>
    );
};