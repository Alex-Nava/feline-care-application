import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import Home from './pages/Home';
import Meals from './pages/Meals';
import Health from './pages/Health';
import Appointments from './pages/Appointments';
import Login from './pages/Login';

function BottomNavbar() {
  const location = useLocation();

  if (location.pathname === '/login') return null;

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-100 shadow-[0_-4px_20px_rgba(0,0,0,0.03)] px-4 py-2 flex justify-around items-center z-50 rounded-t-3xl max-w-md mx-auto">
      
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
  return (
    <Router>
      <div className="min-h-screen bg-slate-50 text-slate-800 pb-24 px-4 py-8 max-w-md mx-auto relative shadow-2xl rounded-none md:rounded-[40px] md:my-4 border border-slate-100">
        
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/meals" element={<Meals />} />
          <Route path="/health" element={<Health />} />
          <Route path="/appointments" element={<Appointments />} />
          <Route path="/login" element={<Login />} />
        </Routes>

        <BottomNavbar />
      </div>
    </Router>
  );
}

export default App;