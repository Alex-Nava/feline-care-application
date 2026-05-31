import React, { useState } from 'react';
import axios from 'axios';

export default function Auth({ onLoginSuccess }) {
  // 'login' | 'register' | 'join_household'
  const [mode, setMode] = useState('login'); 
  
  // Estados para los formularios
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [inviteCode, setInviteCode] = useState('');
  
  // Estado temporal para guardar el ID de usuario recién registrado
  const [tempUserId, setTempUserId] = useState(null);
  const [tempCode, setTempCode] = useState('');
  const [tempHouseholdId, setTempHouseholdId] = useState(null); // <-- Guardamos el ID del hogar creado temporalmente

  // 1. Manejar el Login Tradicional
  const handleLogin = (e) => {
    e.preventDefault();
    axios.post('http://localhost:3000/api/auth/login', { email, password })
      .then(res => {
        localStorage.setItem('token', res.data.token);
        
        // CAPTURA INTELIGENTE: Busca en todas las variantes posibles
        const userData = res.data.user || {};
        const hId = userData.householdId || userData.household_id || res.data.householdId || res.data.household_id;
        
        if (hId) {
          localStorage.setItem('householdId', hId); 
        } else {
          console.error("El backend no envió ningún ID de hogar en el login:", res.data);
        }
        
        onLoginSuccess(userData);
      })
      .catch(err => alert(err.response?.data?.msg || 'Error en las credenciales'));
  };
  // 2. Manejar el Registro (Paso 1: Crea el usuario y su hogar base)
  const handleRegister = (e) => {
    e.preventDefault();
    axios.post('http://localhost:3000/api/auth/register', { name, email, password })
      .then(res => {
        localStorage.setItem('token', res.data.token);
        
        // Almacenamos temporalmente los datos del hogar que el backend le auto-asignó al registrarse
        const userData = res.data.user || {};
        const autoHouseholdId = userData.householdId || userData.household_id || res.data.householdId || res.data.household_id;
        
        setTempUserId(userData.id || res.data.userId);
        setTempCode(res.data.inviteCode || userData.inviteCode);
        setTempHouseholdId(autoHouseholdId); // Se guarda en el estado temporal
        
        setMode('join_household'); // Lo mandamos a la pantalla de decisión de hogar
      })
      .catch(err => alert(err.response?.data?.msg || 'Error al registrarte'));
  };

  // 3. Vincularse a un código existente (Validación estricta de 2 integrantes)
  const handleJoinCode = (e) => {
    e.preventDefault();
    axios.post('http://localhost:3000/api/auth/join-household', {
      userId: tempUserId,
      inviteCode: inviteCode.toUpperCase().trim()
    })
    .then(res => {
      // Si se une con éxito a otra casa, guardamos el ID del nuevo hogar adoptado
      const joinedId = res.data.householdId || res.data.household_id;
      localStorage.setItem('householdId', joinedId);
      
      alert('¡Sincronizado! Te has unido al hogar con éxito. 🎉');
      window.location.href = '/'; // Redirección limpia a la raíz
    })
    .catch(err => {
      alert(err.response?.data?.msg || 'Error al unirse');
    });
  };

  // 4. Acción para Empezar Solo (Parchado 🔥)
  const handleStartSolo = () => {
    if (tempHouseholdId) {
      localStorage.setItem('householdId', tempHouseholdId);
      localStorage.setItem('householdCode', tempCode);
      window.location.href = '/'; // Redirección limpia forzando la lectura de estados
    } else {
      // Si por alguna razón el backend no lo devolvió en el registro, recargamos para validar sesión
      window.location.href = '/';
    }
  };

  return (
    <div className="w-full max-w-md mx-auto min-h-screen flex flex-col justify-center px-6 py-12 animate-fadeIn">
      
      {/* Branding / Logo superior */}
      <div className="text-center mb-8">
        <div className="w-20 h-20 bg-gradient-to-tr from-orange-500 to-amber-400 rounded-3xl mx-auto flex items-center justify-center shadow-lg shadow-orange-100">
          <span className="text-4xl">🐾</span>
        </div>
        <h1 className="text-3xl font-black text-slate-900 tracking-tight mt-4">Feline & Canine Care</h1>
        <p className="text-slate-400 text-xs mt-1 uppercase tracking-wider font-bold">La idea millonaria para el patrón de la casa</p>
      </div>

      {/* Tarjeta contenedora de los formularios */}
      <div className="bg-white p-6 rounded-3xl shadow-xl border border-slate-100 space-y-6">
        
        {/* VISTA 1: LOGIN */}
        {mode === 'login' && (
          <form onSubmit={handleLogin} className="space-y-4">
            <h2 className="text-xl font-black text-slate-800">¡Qué bueno verte de nuevo!</h2>
            
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-500 uppercase">Correo Electrónico</label>
              <input 
                type="email" required placeholder="ejemplo@correo.com"
                value={email} onChange={e => setEmail(e.target.value)}
                className="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-sm focus:outline-none focus:border-orange-500 transition-all"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-500 uppercase">Contraseña</label>
              <input 
                type="password" required placeholder="••••••••"
                value={password} onChange={e => setPassword(e.target.value)}
                className="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-sm focus:outline-none focus:border-orange-500 transition-all"
              />
            </div>

            <button type="submit" className="w-full bg-gradient-to-r from-orange-500 to-amber-500 text-white font-black p-4 rounded-2xl text-sm shadow-md hover:opacity-95 active:scale-95 transition-all">
              Entrar al Panel 🚀
            </button>

            <p className="text-center text-xs text-slate-400 font-medium">
              ¿Eres un esclavo nuevo?{' '}
              <button type="button" onClick={() => setMode('register')} className="text-orange-500 font-bold underline">
                Regístrate aquí
              </button>
            </p>
          </form>
        )}

        {/* VISTA 2: REGISTRO */}
        {mode === 'register' && (
          <form onSubmit={handleRegister} className="space-y-4">
            <h2 className="text-xl font-black text-slate-800">Crea tu cuenta de Cuidador</h2>
            
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-500 uppercase">Tu Nombre / Apodo</label>
              <input 
                type="text" required placeholder="Ej. Alex"
                value={name} onChange={e => setName(e.target.value)}
                className="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-sm focus:outline-none focus:border-orange-500 transition-all"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-500 uppercase">Correo Electrónico</label>
              <input 
                type="email" required placeholder="michi-lover@correo.com"
                value={email} onChange={e => setEmail(e.target.value)}
                className="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-sm focus:outline-none focus:border-orange-500 transition-all"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-500 uppercase">Contraseña Segura</label>
              <input 
                type="password" required placeholder="Mínimo 6 caracteres"
                value={password} onChange={e => setPassword(e.target.value)}
                className="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-sm focus:outline-none focus:border-orange-500 transition-all"
              />
            </div>

            <button type="submit" className="w-full bg-slate-900 text-white font-black p-4 rounded-2xl text-sm shadow-md active:scale-95 transition-all">
              Siguiente Paso ➡️
            </button>

            <p className="text-center text-xs text-slate-400 font-medium">
              ¿Ya tienes cuenta?{' '}
              <button type="button" onClick={() => setMode('login')} className="text-orange-500 font-bold underline">
                Inicia sesión
              </button>
            </p>
          </form>
        )}

        {/* VISTA 3: CONFIGURACIÓN LOGÍSTICA DEL HOGAR */}
        {mode === 'join_household' && (
          <div className="space-y-5">
            <div className="p-4 bg-emerald-50 border border-emerald-100 rounded-2xl text-center">
              <p className="text-xs font-bold text-emerald-800">¡Cuenta creada con éxito! 🥳</p>
              <p className="text-[11px] text-emerald-700 mt-0.5">Tu código de hogar asignado es: <span className="font-black tracking-wider text-sm">{tempCode}</span></p>
            </div>

            <div className="text-center space-y-1">
              <h2 className="text-lg font-black text-slate-800">¿Cómo vas a cuidar hoy?</h2>
              <p className="text-xs text-slate-400 px-4">Puedes empezar solo con tu código asignado o unirte al hogar de otra persona.</p>
            </div>

            {/* Opción A: Empezar Solo (Llama a nuestra función parchada) */}
            <button 
              onClick={handleStartSolo} 
              className="w-full bg-orange-500 text-white font-black p-3.5 rounded-2xl text-xs shadow-md active:scale-95 transition-all"
            >
              🏠 Empezar mi propio Hogar (Usa tu código {tempCode})
            </button>

            <div className="relative flex py-2 items-center">
              <div className="flex-grow border-t border-slate-200"></div>
              <span className="flex-shrink mx-3 text-slate-400 text-[10px] font-bold uppercase tracking-wider">O ÚNETE A OTRA PERSONA</span>
              <div className="flex-grow border-t border-slate-200"></div>
            </div>

            {/* Opción B: Unirse a través de un código compartido */}
            <form onSubmit={handleJoinCode} className="space-y-3">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-500 uppercase">Código de Invitación del Hogar</label>
                <input 
                  type="text" required placeholder="Ej: MICH-1234" maxLength="9"
                  value={inviteCode} onChange={e => setInviteCode(e.target.value)}
                  className="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-center font-mono font-black text-sm uppercase tracking-widest focus:outline-none focus:border-sky-500 transition-all"
                />
              </div>

              <button type="submit" className="w-full bg-slate-900 text-white font-black p-3.5 rounded-2xl text-xs shadow-md active:scale-95 transition-all">
                🔗 Sincronizar y Vincular Hogar
              </button>
            </form>
          </div>
        )}

      </div>
    </div>
  );
}