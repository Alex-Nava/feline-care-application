import React, { useState, useEffect } from 'react';
import axios from 'axios';

export default function LitterBox() {
  const [boxData, setBoxData] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // Estados para el minijuego de limpieza (Temporizador)
  const [isCleaning, setIsCleaning] = useState(false);
  const [timeLeft, setTimeLeft] = useState(30);
  const [currentHour, setCurrentHour] = useState(new Date().getHours());

  // Simular paso del tiempo para actualizar los candados dinámicamente cada minuto
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentHour(new Date().getHours());
    }, 60000);
    return () => clearInterval(timer);
  }, []);

  // Cargar telemetría desde el backend
  const fetchLitterBoxData = () => {
    axios.get('http://localhost:3000/api/litterbox')
      .then(res => {
        setBoxData(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error al traer datos del arenero:', err);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchLitterBoxData();
  }, []);

  // Lógica del contador regresivo de 30 segundos
  useEffect(() => {
    if (!isCleaning) return;
    if (timeLeft === 0) {
      // Cuando se acaba el tiempo, disparamos el registro real en el backend
      setIsCleaning(false);
      axios.post('http://localhost:3000/api/litterbox/clean')
        .then(res => {
          setBoxData(res.data.box || res.data);
          setTimeLeft(30); // Reset del reloj para la próxima
        })
        .catch(err => console.error('Error al registrar limpieza:', err));
      return;
    }

    const intervalId = setInterval(() => {
      setTimeLeft(prev => prev - 1);
    }, 1000);

    return () => clearInterval(intervalId);
  }, [isCleaning, timeLeft]);

  const handleSetup = (uses, type = null) => {
    axios.post('http://localhost:3000/api/litterbox/setup', {
      uses_litterbox: uses,
      sand_type: type
    })
    .then(res => setBoxData(res.data))
    .catch(err => console.error('Error en setup:', err));
  };

  const handleResetBattery = () => {
    axios.post('http://localhost:3000/api/litterbox/reset-battery')
      .then(res => setBoxData(res.data))
      .catch(err => console.error('Error al reiniciar arena:', err));
  };

  // Iniciar la secuencia de limpieza de 30 segundos
  const startCleaningMission = () => {
    setTimeLeft(30);
    setIsCleaning(true);
  };

  if (loading) return <div className="text-center p-10 text-slate-400">Cargando telemetría del arenero...</div>;

  // --- CÁLCULO DE LA BATERÍA GLOBAL ---
  let batteryPercentage = 100;
  let maxDays = 15;
  if (boxData && boxData.uses_litterbox && boxData.last_full_change) {
    if (boxData.sand_type === 'aglomerante') maxDays = 15;
    if (boxData.sand_type === 'no_aglomerante') maxDays = 7;
    if (boxData.sand_type === 'silice') maxDays = 30;

    const lastChange = new Date(boxData.last_full_change);
    const today = new Date();
    const diffTime = Math.abs(today - lastChange);
    const daysPassed = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    batteryPercentage = Math.max(Math.round(((maxDays - daysPassed) / maxDays) * 100), 0);
  }

  // --- DETERMINAR ESTADO DE LAS VENTANAS DE TIEMPO ---
  // Mañana: 6:00 AM a 2:00 PM (horas 6 a 13)
  const isMorningWindow = currentHour >= 6 && currentHour < 14;
  // Noche: 6:00 PM a 11:59 PM (horas 18 a 23)
  const isEveningWindow = currentHour >= 18 && currentHour < 24;

  // --- TEXTOS MEMES TIKTOK PARA FEEDBACK DIARIO ---
  const getDailyFeedback = () => {
    const morning = boxData?.cleaned_morning;
    const evening = boxData?.cleaned_evening;

    if (!morning && !evening) {
      return { text: "POV: Eres el esclavo del michi y no has recogido nada hoy. Quedaste 🤡. El arenero es zona de desastre.", color: "border-rose-200 bg-rose-50 text-rose-900" };
    }
    if ((isMorningWindow && !morning) || (isEveningWindow && !evening)) {
      return { text: "El michi está parado en la esquina mirándote fijo tipo: '¿Acaso mi higiene es un chiste para ti?' 🤨 Te toca limpiar.", color: "border-amber-200 bg-amber-50 text-amber-900" };
    }
    if (morning && !evening && !isEveningWindow) {
      return { text: "Misión de la mañana completada. El michi: 'Vaya, sirves para algo'. Esperando el turno noche... ⏳", color: "border-blue-200 bg-blue-50 text-blue-900" };
    }
    return { text: "¡Es hoy, es hoy! ¡Arenero al 100% libre de toxinas! El michi: *procede a meterse y cagar de nuevo inmediatamente* 🕺✨", color: "border-emerald-200 bg-emerald-50 text-emerald-900" };
  };

  const getBatteryMessage = (pct) => {
    if (pct > 70) return "¡Huele a flores frescas! El michi aprueba tu humilde servicio. 🌸✨";
    if (pct > 30) return "Ya se siente el 'ambiente felino'... Se viene el evento canónico de la peste. 😼💨";
    if (pct > 0) return "¡Peligro biológico inminente! Una ráfaga más y colapsa la cuadra. ☣️💀";
    return "🚨 ¡ALERTA MÁXIMA! El michi está planeando miar tu mochila de la UNSA si no cambias esa arena ¡YA!";
  };

  return (
    <div className="w-full max-w-md mx-auto space-y-6 animate-fadeIn pb-12">
      
      {/* Encabezado */}
      <div className="text-center">
        <h2 className="text-3xl font-black text-slate-900 tracking-tight">📦 El Arenero</h2>
        <p className="text-slate-400 text-sm mt-1">Higiene y control estricto de residuos</p>
      </div>

      {/* FILTRO PRINCIPAL: ¿Usa arenero? */}
      <div className="bg-white p-5 rounded-3xl shadow-xl border border-slate-100 space-y-4">
        <div className="flex justify-between items-center">
          <div>
            <h3 className="font-bold text-slate-800 text-sm">¿Tu gato usa arenero en casa?</h3>
            <p className="text-xs text-slate-400">Desactívalo si hace en el patio</p>
          </div>
          <button 
            onClick={() => handleSetup(!boxData.uses_litterbox, boxData.sand_type || 'aglomerante')}
            className={`px-4 py-2 rounded-2xl font-bold text-xs transition-all ${
              boxData.uses_litterbox ? 'bg-emerald-500 text-white shadow-md' : 'bg-slate-100 text-slate-500'
            }`}
          >
            {boxData.uses_litterbox ? 'SÍ, USA' : 'NO, PATIO'}
          </button>
        </div>

        {boxData.uses_litterbox && (
          <div className="pt-3 border-t border-slate-100 space-y-3">
            <label className="block text-xs font-bold text-slate-500 uppercase">Tipo de Arena Actual:</label>
            <div className="grid grid-cols-1 gap-2">
              {[
                { id: 'aglomerante', name: '🟢 Arena Aglomerante', desc: 'Forma bolas compactas. Rinde 15-20 días.' },
                { id: 'no_aglomerante', name: '🔵 Arena No Aglomerante', desc: 'Económica. Se satura rápido. Rinde 7 days.' },
                { id: 'silice', name: '💎 Perlas de Sílice', desc: 'Cristales de alta absorción. Rinde hasta 30 días.' }
              ].map(arena => (
                <button
                  key={arena.id}
                  onClick={() => handleSetup(true, arena.id)}
                  className={`p-3 rounded-2xl text-left border transition-all ${
                    boxData.sand_type === arena.id ? 'border-orange-500 bg-orange-50 text-orange-950 font-semibold' : 'border-slate-100 bg-white text-slate-700'
                  }`}
                >
                  <p className="text-xs font-bold">{arena.name}</p>
                  <p className="text-[11px] text-slate-400 font-normal">{arena.desc}</p>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* CONTROLES AVANZADOS POR BATERÍA Y TIEMPO */}
      {boxData.uses_litterbox && (
        <div className="space-y-4">
          
          {/* PANEL 1: LA GRAN BATERÍA DE LA ARENA */}
          <div className="bg-white p-5 rounded-3xl shadow-xl border border-slate-100 space-y-4">
            <div className="flex justify-between items-center">
              <h4 className="font-bold text-slate-800 text-xs uppercase tracking-wider">⚡ Vida Útil de la Arena</h4>
              <span className="text-xs text-slate-400 font-medium">Límite: {maxDays} días</span>
            </div>

            <div className="flex items-center gap-2">
              <div className="flex-1 bg-slate-100 border border-slate-200 h-8 rounded-xl p-1 relative overflow-hidden flex items-center">
                <div 
                  className={`h-full rounded-lg transition-all duration-700 ${batteryPercentage > 70 ? 'bg-emerald-500' : batteryPercentage > 30 ? 'bg-amber-500' : 'bg-rose-600 animate-pulse'}`}
                  style={{ width: `${batteryPercentage}%` }}
                />
                <span className="absolute left-4 font-black text-xs mix-blend-difference text-white">
                  {batteryPercentage}% DISPONIBLE
                </span>
              </div>
              <div className="w-1.5 h-4 bg-slate-300 rounded-r-sm -ml-2" />
            </div>

            <p className="text-xs font-medium text-slate-600 italic bg-slate-50 p-3 rounded-xl border border-slate-100">
              {getBatteryMessage(batteryPercentage)}
            </p>

            <button
              onClick={handleResetBattery}
              className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold p-3 rounded-2xl text-xs transition-all active:scale-[0.98]"
            >
              ✨ ¡Puse arena nueva limpia! (Reset total)
            </button>
          </div>

          {/* PANEL 2: RECOGIDAS DIARIAS CONTROLADAS (EL MINIJUEGO DE 30s) */}
          <div className="bg-white p-5 rounded-3xl shadow-xl border border-slate-100 space-y-4">
            <h4 className="font-bold text-slate-800 text-xs uppercase tracking-wider">🧹 Tareas de Limpieza Cruda</h4>

            {/* INTERFAZ EN MODO MINIJUEGO ACTIVADO */}
            {isCleaning ? (
              <div className="p-4 bg-orange-50 border border-orange-200 rounded-2xl text-center space-y-3 animate-pulse">
                <p className="text-sm font-black text-orange-900">🚨 ¡MINIJUEGO DE LIMPIEZA ACTIVO! 🚨</p>
                <p className="text-xs text-orange-700">Tienes exactamente para retirar los grumos:</p>
                <div className="text-4xl font-black text-orange-600 tracking-widest">{timeLeft}s</div>
                <div className="w-full bg-orange-200 h-2 rounded-full overflow-hidden">
                  <div className="bg-orange-600 h-full transition-all duration-1000" style={{ width: `${(timeLeft / 30) * 100}%` }} />
                </div>
                <p className="text-[11px] text-orange-500 italic">Corre, limpia y espera que el contador llegue a 0 para validar.</p>
              </div>
            ) : (
              /* INTERFAZ EN MODO NORMAL: BOTONES INTELIGENTES BLOQUEADOS */
              <div className="space-y-3">
                
                {/* Botón Turno Mañana (6:00 AM - 2:00 PM) */}
                <div className="flex items-center gap-2">
                  <button
                    disabled={!isMorningWindow || boxData.cleaned_morning}
                    onClick={startCleaningMission}
                    className={`flex-1 p-4 rounded-2xl text-left border flex justify-between items-center transition-all ${
                      boxData.cleaned_morning
                        ? 'bg-emerald-50 border-emerald-200 text-emerald-800 cursor-not-allowed'
                        : isMorningWindow
                        ? 'bg-white border-orange-200 text-slate-800 shadow-md hover:border-orange-500 active:scale-95'
                        : 'bg-slate-100 border-slate-200 text-slate-400 cursor-not-allowed'
                    }`}
                  >
                    <div>
                      <p className="font-bold text-xs">🌅 Turno Mañana (06:00 AM - 02:00 PM)</p>
                      <p className="text-[11px] text-slate-400">
                        {boxData.cleaned_morning ? 'Limpieza guardada' : isMorningWindow ? '💥 ¡Disponible! Dale click' : '🔒 Fuera de horario'}
                      </p>
                    </div>
                    <span className="text-xs font-black">
                      {boxData.cleaned_morning ? '✅ Listo' : isMorningWindow ? '🧹 Limpiar' : '🔒 Bloqueado'}
                    </span>
                  </button>
                </div>

                {/* Botón Turno Noche (6:00 PM - 11:59 PM) */}
                <div className="flex items-center gap-2">
                  <button
                    disabled={!isEveningWindow || boxData.cleaned_evening}
                    onClick={startCleaningMission}
                    className={`flex-1 p-4 rounded-2xl text-left border flex justify-between items-center transition-all ${
                      boxData.cleaned_evening
                        ? 'bg-emerald-50 border-emerald-200 text-emerald-800 cursor-not-allowed'
                        : isEveningWindow
                        ? 'bg-white border-orange-200 text-slate-800 shadow-md hover:border-orange-500 active:scale-95'
                        : 'bg-slate-100 border-slate-200 text-slate-400 cursor-not-allowed'
                    }`}
                  >
                    <div>
                      <p className="font-bold text-xs">🌌 Turno Noche (06:00 PM - 11:59 PM)</p>
                      <p className="text-[11px] text-slate-400">
                        {boxData.cleaned_evening ? 'Limpieza guardada' : isEveningWindow ? '💥 ¡Disponible! Dale click' : '🔒 Fuera de horario'}
                      </p>
                    </div>
                    <span className="text-xs font-black">
                      {boxData.cleaned_evening ? '✅ Listo' : isEveningWindow ? '🧹 Limpiar' : '🔒 Bloqueado'}
                    </span>
                  </button>
                </div>

              </div>
            )}
          </div>

          {/* PANEL 3: RESUMEN Y MÓDULO DE FEEDBACK DIARIO MARCA REGISTRADA 🤡 */}
          <div className={`p-4 rounded-3xl border text-xs font-bold transition-all shadow-md ${getDailyFeedback().color}`}>
            <p className="uppercase text-[10px] tracking-wider mb-1 opacity-75">📋 Estatus de hoy:</p>
            <p className="text-sm font-medium">{getDailyFeedback().text}</p>
          </div>

        </div>
      )}

    </div>
  );
}