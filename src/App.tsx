import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AuthProvider } from '@/context/AuthContext'
import { ProtectedRoute } from '@/components/layout/ProtectedRoute'
import Landing from '@/pages/Landing'
import PostulacionForm from '@/pages/PostulacionForm'
import PostulacionExito from '@/pages/PostulacionExito'
import AdminLogin from '@/pages/AdminLogin'
import Dashboard from '@/pages/admin/Dashboard'

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Rutas públicas */}
          <Route path="/" element={<Landing />} />
          <Route path="/postulacion" element={<PostulacionForm />} />
          <Route path="/postulacion/exito" element={<PostulacionExito />} />
          
          {/* Ruta de login admin */}
          <Route path="/admin/login" element={<AdminLogin />} />
          
          {/* Rutas protegidas de admin */}
          <Route element={<ProtectedRoute />}>
            <Route path="/admin/dashboard" element={<Dashboard />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App
