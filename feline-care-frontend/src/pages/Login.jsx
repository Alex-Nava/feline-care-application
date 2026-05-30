import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    
    // Por ahora, simulamos un login exitoso
    if (email && password) {
      console.log('Iniciando sesión con:', { email, password });
      
      // Aquí irá la validación real con el backend más adelante.
      // Redirigimos al usuario al Inicio (Home) automáticamente:
      navigate('/');
    }
  };

  return (
    <div className="flex flex-col justify-center min-h-[75vh] px-2 animate-fadeIn">
      
      {/* Encabezado de bienvenida */}
      <div className="text-center mb-8">
        <div className="text-5xl mb-3 inline-block transform hover:scale-110 transition-transform cursor-default">
          🔒
        </div>
        <h2 className="text-3xl font-black text-slate-900 tracking-tight">¡Hola de nuevo!</h2>
        <p className="text-slate-400 mt-2 text-sm">
          Ingresa las credenciales compartidas de la casa
        </p>
      </div>

      {/* Formulario */}
      <form onSubmit={handleLogin} className="space-y-4">
        
        {/* Campo de Correo */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-slate-500 uppercase tracking-wider pl-1">
            Correo Electrónico
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="ejemplo@correo.com"
            className="w-full text-sm p-4 bg-white rounded-2xl border border-slate-200/80 focus:ring-2 focus:ring-orange-400 focus:border-transparent outline-none transition-all text-slate-700 shadow-sm"
            required
          />
        </div>

        {/* Campo de Contraseña */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-slate-500 uppercase tracking-wider pl-1">
            Contraseña
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            className="w-full text-sm p-4 bg-white rounded-2xl border border-slate-200/80 focus:ring-2 focus:ring-orange-400 focus:border-transparent outline-none transition-all text-slate-700 shadow-sm"
            required
          />
        </div>

        {/* Botón de Ingreso */}
        <button
          type="submit"
          className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold p-4 rounded-2xl shadow-xl transition-all duration-200 active:scale-[0.98] mt-6 tracking-wide text-sm"
        >
          Entrar a Feline Care
        </button>
      </form>

      {/* Recordatorio inferior simulado */}
      <p className="text-center text-xs text-slate-400 mt-8">
        ¿Olvidaste la contraseña de la casa? <span className="text-orange-500 font-semibold cursor-pointer hover:underline">Pregúntale a tu administrador</span>
      </p>

    </div>
  );
}