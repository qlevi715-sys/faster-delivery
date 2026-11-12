import './App.css'
import { LoginPage } from './pages/LoginPage'
import { RegisterPage } from './pages/RegisterPages'
import { useAuth } from './context/useAuth'
import { DashboardPage } from './pages/Dashboard'
import { ProfilePage } from './pages/ProfilePage'
import { Toaster } from "sonner";
import { BrowserRouter, Navigate, Outlet, Routes, Route, useNavigate } from 'react-router-dom'
import { MainLayout } from './components/MainLayout'
import { CategoriesPage } from './pages/CategoriesPage'
import { ProductCreatePage } from './pages/ProductCreatePage'

const ProtectedRoute = () => {
  const { isAuthenticated, isHydrated } = useAuth()
  if (!isHydrated) return null
  return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />
}

//GUARDAR LA RUTA PUBLICA
const PublicRoute = () => {
  const { isAuthenticated, isHydrated } = useAuth()
  if (!isHydrated) return null
  return !isAuthenticated ? <Outlet /> : <Navigate to="/catalog" replace />
}

// Le pasa a ProfilePage la prop que exige
const ProfileRoute = () => {
  const navigate = useNavigate()
  return <ProfilePage onBackToDashboard={() => navigate("/catalog")} />
}

const LoginRoute = () => {
  const navigate = useNavigate()
  return <LoginPage onNavigateToRegister={() => navigate("/register")} />
}

const RegisterRoute = () => {
  const navigate = useNavigate()
  return <RegisterPage onNavigateToLogin={() => navigate("/login")} />
}

function App() {
  return (
    <BrowserRouter>
      <Toaster />
      <Routes>
        {/*RUTAS PUBLICAS*/}
        <Route element={<PublicRoute />}>
          <Route path='/login' element={<LoginRoute />} />
          <Route path='/register' element={<RegisterRoute />} />
        </Route>

        <Route element={<ProtectedRoute />}>
          <Route element={<MainLayout />}>
            <Route path='/' element={<Navigate to="/catalog" />} />
            <Route path='/catalog' element={<DashboardPage />} />
            <Route path='/categories/create' element={<CategoriesPage />} />
            <Route path='/products/create' element={<ProductCreatePage />} />
            <Route path='/profile' element={<ProfileRoute />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App