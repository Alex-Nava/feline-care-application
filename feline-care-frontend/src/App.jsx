import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation, Navigate } from 'react-router-dom';
import Home from './pages/Home';
import Meals from './pages/Meals';
import Health from './pages/Health';
import Appointments from './pages/Appointments';
import Auth from './pages/Auth'; // Reemplazamos Login por nuestro Auth Inteligente
import LitterBox from './pages/LitterBox';

function BottomNavbar({ isAuthenticated }) {
  const location = useLocation();

  // Si no está autenticado, no pintamos la barra de navegación por seguridad
  if (!isAuthenticated) return null;

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-100 shadow-[0_-4px_20px_rgba(0,0,0,0.03)] px-2 py-2 flex justify-around items-center z-50 rounded-t-3xl max-w-md mx-auto">
      
      {/* Botón Inicio */}
      <Link 
        to="/" 
        className={`flex flex-col items-center gap-1 p-2 transition-all duration-200 ${
          location.pathname === '/' 
            ? 'text-orange-600 font-extrabold scale-110 opacity-100' 
            : 'text-slate-400 font-medium hover:text-slate-600 opacity-80'
        }`}
      >
        <span className="text-2xl">🏠</span>
        <span className="text-[11px]">Inicio</span>
      </Link>

      {/* Botón Comidas */}
      <Link 
        to="/meals" 
        className={`flex flex-col items-center gap-1 p-2 transition-all duration-200 ${
          location.pathname === '/meals' 
            ? 'text-orange-600 font-extrabold scale-110 opacity-100' 
            : 'text-slate-400 font-medium hover:text-slate-600 opacity-80'
        }`}
      >
        <span className="text-2xl">🍲</span>
        <span className="text-[11px]">Comidas</span>
      </Link>

      {/* Botón Arenero */}
      <Link 
        to="/litterbox" 
        className={`flex flex-col items-center gap-1 p-2 transition-all duration-200 ${
          location.pathname === '/litterbox' 
            ? 'text-orange-600 font-extrabold scale-110 opacity-100' 
            : 'text-slate-400 font-medium hover:text-slate-600 opacity-80'
        }`}
      >
        <span className="text-2xl">📦</span>
        <span className="text-[11px]">Arenero</span>
      </Link>

      {/* Botón Salud */}
      <Link 
        to="/health" 
        className={`flex flex-col items-center gap-1 p-2 transition-all duration-200 ${
          location.pathname === '/health' 
            ? 'text-orange-600 font-extrabold scale-110 opacity-100' 
            : 'text-slate-400 font-medium hover:text-slate-600 opacity-80'
        }`}
      >
        <span className="text-2xl">❤️</span>
        <span className="text-[11px]">Salud</span>
      </Link>

      {/* Botón Citas */}
      <Link 
        to="/appointments" 
        className={`flex flex-col items-center gap-1 p-2 transition-all duration-200 ${
          location.pathname === '/appointments' 
            ? 'text-orange-600 font-extrabold scale-110 opacity-100' 
            : 'text-slate-400 font-medium hover:text-slate-600 opacity-80'
        }`}
      >
        <span className="text-2xl">📅</span>
        <span className="text-[11px]">Citas</span>
      </Link>
      
    </nav>
  );
}

function App() {
  const [user, setUser] = useState(null);
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [notes, setNotes] = useState([]);

  useEffect(() => {
    // Al arrancar, verificamos si el celular ya tiene un token guardado
    const token = localStorage.getItem('token');
    if (token) {
      setUser({ logged: true });
    }
    setCheckingAuth(false);
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    setUser(null);
  };

  const cargarNotas = async () => {
  try {
    const householdId = localStorage.getItem('householdId');
    if (!householdId) return;

    const res = await axios.get(`http://localhost:3000/api/notes?householdId=${householdId}`);
    setNotes(res.data); // Aquí guardamos las notas
  } catch (err) {
    console.error("Error al traer notas:", err);
  }
};

  if (checkingAuth) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center text-slate-400 text-xs font-bold">
        Sincronizando credenciales... 🐾
      </div>
    );
  }

  return (
    <Router>
      <div className="min-h-screen bg-slate-50 text-slate-800 pb-24 px-4 py-8 max-w-md mx-auto relative shadow-2xl rounded-none md:rounded-[40px] md:my-4 border border-slate-100">
        
        {/* Cabecera superior de control de sesión (Solo visible si estás adentro) */}
        {user && (
          <div className="w-full flex justify-between items-center mb-6 px-2">
            <span className="text-xs font-black text-slate-400 uppercase tracking-wider">🐾 Panel del Hogar</span>
            <button 
              onClick={handleLogout} 
              className="text-[11px] font-black text-rose-500 bg-rose-50/60 border border-rose-100 px-3 py-1.5 rounded-2xl active:scale-95 transition-all"
            >
              Cerrar Sesión 🚪
            </button>
          </div>
        )}

        <Routes>
          {/* Si el usuario NO está logeado, cualquier ruta lo rebota a /auth */}
          <Route path="/" element={user ? <Home notes={notes} cargarNotas={cargarNotas} /> : <Navigate to="/auth" />} />
          <Route path="/meals" element={user ? <Meals /> : <Navigate to="/auth" />} />
          <Route path="/health" element={user ? <Health /> : <Navigate to="/auth" />} />
          <Route path="/appointments" element={user ? <Appointments /> : <Navigate to="/auth" />} />
          <Route path="/litterbox" element={user ? <LitterBox /> : <Navigate to="/auth" />} />
          
          {/* Ruta de autenticación: Si ya está logeado y entra aquí por error, lo manda al Home */}
          <Route path="/auth" element={!user ? <Auth onLoginSuccess={(userData) => setUser(userData)} /> : <Navigate to="/" />} />
          
          {/* Redirección por defecto si meten una URL rara */}
          <Route path="*" element={<Navigate to={user ? "/" : "/auth"} />} />
        </Routes>

        {/* Pasamos el estado de autenticación a la barra inferior */}
        <BottomNavbar isAuthenticated={!!user} />
      </div>
    </Router>
  );
}

export default App;