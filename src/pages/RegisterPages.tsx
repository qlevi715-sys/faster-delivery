import React from "react";
import { useRegisterViewModel } from "../viewmodels/use-register";
import { FieldError } from "../components/FieldError";

interface RegisterPageProps {
    onNavigateToLogin: () => void;
}

const inputClass =
    "w-full px-4 py-3 mb-2 border border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500 rounded-lg outline-none placeholder-slate-400 transition-all aria-invalid:border-red-500 aria-invalid:focus:border-red-500 aria-invalid:focus:ring-red-500";

export const RegisterPage: React.FC<RegisterPageProps> = ({
    onNavigateToLogin
}) => {

    // Al registrarse con éxito, el usuario pasa a la pantalla de login.
    const {
        form,
        confirmPassword,
        handleConfirmPasswordChange,
        isLoading,
        fieldErrors,
        handleChange,
        submit
    } = useRegisterViewModel(onNavigateToLogin)

    return (
        <div className="min-h-screen flex flex-col relative overflow-hidden font-sans">
            <header className="relative w-full border border-slate-100 bg-white/80">
                <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-8">
                        <span className="font-bold text-slate-950">Levip</span>
                        <nav className="hidden md:flex items-center gap-8 font-medium text-slate-600">
                            <a href="">Explorar</a>
                            <a href="">Ofertas</a>
                            <a href="">Historia</a>
                            <a href="">Ayuda</a>
                        </nav>
                    </div>
                    <div className="flex items-center">
                        <button
                            className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-semibold"
                            onClick={onNavigateToLogin}
                        >
                            Loguearse
                        </button>
                    </div>
                </div>
            </header>
            <main className="flex-1 mx-w-8xl w-full mx-auto px-6 py-10 items-center justify-center">
                <div className="flex justify-center">
                    <div className="w-full max-w-lg rounded-2xl shadow-xl border p-8 sm:p-10">
                        <div className="mb-8">
                            <h1 className="text-3xl font-black">Crear una cuenta</h1>
                            <p className="mt-2.5 text-sm font-medium">
                                Crea tu cuenta y disfruta de las promociones recientes
                            </p>
                        </div>
                        <form onSubmit={submit} noValidate>
                            <label htmlFor=
                                "nombre"
                                className="block text-xs font-semibold uppercase mb-2"

                            >
                                Nombre completo
                            </label>
                            <input
                                id="nombre"
                                name="nombre"
                                type="text"
                                value={form.name}
                                onChange={(e) => handleChange("name", e.target.value)}
                                className={inputClass}
                                placeholder="Registra tu nombre"
                                aria-invalid={Boolean(fieldErrors.name)}
                                aria-describedby="nombre-error"
                                required
                            />
                            <FieldError id="nombre-error" message={fieldErrors.name} />

                            <label
                                htmlFor="apellido"
                                className="block text-xs font-semibold uppercase mb-2 mt-2"
                            >
                                Apellido
                            </label>

                            <input
                                id="apellido"
                                name="apellido"
                                type="text"
                                value={form.lastname}
                                onChange={(e) => handleChange("lastname", e.target.value)}
                                className={inputClass}
                                placeholder="Registra tu apellido"
                                aria-invalid={Boolean(fieldErrors.lastname)}
                                aria-describedby="apellido-error"
                                required
                            />
                            <FieldError id="apellido-error" message={fieldErrors.lastname} />

                            <label htmlFor="correo" className="block text-xs font-semibold uppercase mb-2 mt-2">
                                Direccion de correo electronico
                            </label>
                            <input
                                id="correo"
                                name="correo"
                                type="email"
                                value={form.email}
                                onChange={(e) => handleChange("email", e.target.value)}
                                className={inputClass}
                                placeholder="example@gmail.com"
                                aria-invalid={Boolean(fieldErrors.email)}
                                aria-describedby="correo-error"
                                required
                            />
                            <FieldError id="correo-error" message={fieldErrors.email} />

                            <label htmlFor="telefono" className="block text-xs font-semibold uppercase mb-2 mt-2">
                                Teléfono
                            </label>

                            <input
                                id="telefono"
                                name="telefono"
                                type="tel"
                                inputMode="numeric"
                                value={form.phone}
                                onChange={(e) => handleChange("phone", e.target.value)}
                                className={inputClass}
                                placeholder="77788548"
                                aria-invalid={Boolean(fieldErrors.phone)}
                                aria-describedby="telefono-error"
                                required
                            />
                            <FieldError id="telefono-error" message={fieldErrors.phone} />

                            <div>
                                <label htmlFor="password" className="block text-xs font-semibold uppercase mb-2 mt-2">
                                    Contraseña
                                </label>
                                <input
                                    value={form.password}
                                    id="password"
                                    name="password"
                                    type="password"
                                    onChange={(e) => handleChange("password", e.target.value)}
                                    className={inputClass}
                                    placeholder="Digita tu contraseña"
                                    aria-invalid={Boolean(fieldErrors.password)}
                                    aria-describedby="password-error"
                                    required
                                />
                                <FieldError id="password-error" message={fieldErrors.password} />
                            </div>

                            <div>
                                <label htmlFor="confirm-password" className="block text-xs font-semibold uppercase mb-2 mt-2">
                                    Confirmar Contraseña
                                </label>
                                <input
                                    id="confirm-password"
                                    name="confirm-password"
                                    type="password"
                                    value={confirmPassword}
                                    onChange={(e) => handleConfirmPasswordChange(e.target.value)}
                                    className={inputClass}
                                    placeholder="Digita tu contraseña de confirmacion"
                                    aria-invalid={Boolean(fieldErrors.confirmPassword)}
                                    aria-describedby="confirm-password-error"
                                    required
                                />
                                <FieldError id="confirm-password-error" message={fieldErrors.confirmPassword} />
                            </div>

                            <button
                                type="submit"
                                disabled={isLoading}
                                className="mt-4 w-full py-3 px-4 bg-blue-800 rounded-lg text-white hover:bg-blue-900 hover:shadow-lg transition-all duration-200 active:scale-[0.98] disabled:opacity-50"
                            >
                                {isLoading ? "Creando cuenta..." : "crear cuenta"}
                            </button>

                        </form>
                    </div>
                </div>
            </main>
        </div>
    );
};
