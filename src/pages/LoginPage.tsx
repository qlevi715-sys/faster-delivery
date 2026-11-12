import type React from "react";
import { useLoginViewModel } from "../viewmodels/user-login";
import { FieldError } from "../components/FieldError";

interface LoginPageProps {
  onNavigateToRegister: () => void
}

export const LoginPage: React.FC<LoginPageProps> = ({
  onNavigateToRegister
}) => {
  const {
    email,
    password,
    setEmail,
    setPassword,
    isLoading,
    error,
    fieldErrors,
    submit
  } = useLoginViewModel()
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <header className="relative w-full border border-slate-100 bg-white/80">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-8">
            <span className="font-bold text-slate-950">Faster Delivery</span>
            <nav className="hidden md:flex items-center gap-8 font-medium text-slate-600">
              <a href="" className="hover:text-indigo-600 transition-colors">
                Explorar
              </a>
              <a href="" className="hover:text-indigo-600 transition-colors">
                Ofertas
              </a>
              <a href="" className="hover:text-indigo-600 transition-colors">
                Historia
              </a>
              <a href="" className="hover:text-indigo-600 transition-colors">
                Ayuda
              </a>
            </nav>
          </div>
          <div className="flex items-center">
            <button
              className="px-5 py-3 bg-indigo-700 text-white hover:bg-indigo-600 rounded-lg text-sm font-semibold transition-all shadow-sm hover:shadow-indigo-100"
              onClick={onNavigateToRegister}
            >
              Registrarse
            </button>
          </div>
        </div>

      </header>
      <main className="flex flex-1 flex-col items-center justify-center px-4 py-12">
        <div className="w-full max-w-md space-y-8">
          <div className="text-center">
            <h1 className="text-3xl font-extrabold text-slate-900">Bienvenido</h1>
            <p className="mt-2">Inicia sesión en tu cuenta</p>
          </div>
          <form onSubmit={submit} noValidate>
            <input
              type="email"
              autoComplete="email"
              className="w-full px-4 py-3 border border-slate-400 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all aria-invalid:border-red-500 aria-invalid:focus:border-red-500 aria-invalid:focus:ring-red-500"
              placeholder="Correo electrónico"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              aria-invalid={Boolean(fieldErrors.email)}
              aria-describedby="login-email-error"
              required
            />
            <FieldError id="login-email-error" message={fieldErrors.email} />
            <input
              type="password"
              autoComplete="current-password"
              className="w-full mt-2 mb-1 px-4 py-3 border border-slate-400 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all aria-invalid:border-red-500 aria-invalid:focus:border-red-500 aria-invalid:focus:ring-red-500"
              placeholder="Contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              aria-invalid={Boolean(fieldErrors.password)}
              aria-describedby="login-password-error"
              required
            />
            <FieldError id="login-password-error" message={fieldErrors.password} />
            <div className="mb-3" />
            <div className="flex items-center justify-between">
              <label
                htmlFor=""
                className="flex items-center gap-2 cursor-pointer select-none"
              >
                <input
                  type="checkbox"
                  className="w-4 h-4 rounded border-slate-300"
                />
                <span className="text-sm text-slate-950">
                  Recuérdame
                </span>
              </label>
              <a href="" className="text-sm font-semibold text-blue-700 hover:text-blue-800 transition-colors">
                Olvidé mi contraseña
              </a>
            </div>
            <div className="mt-4">
              {error && (
                <p role="alert" className="mb-3 text-sm text-red-500">{error}</p>
              )}
              <button
                className="w-full py-3 px-4 bg-blue-800 rounded-lg text-white hover:bg-blue-900 hover:shadow-lg transition-all duration-200 active:scale-[0.98] disabled:opacity-50"
                type="submit"
                disabled={isLoading}
              >
                {isLoading ? "Ingresando al sistema..." : "Loguearse"}
              </button>
            </div>

          </form>
        </div>
      </main>
    </div>
  );
};