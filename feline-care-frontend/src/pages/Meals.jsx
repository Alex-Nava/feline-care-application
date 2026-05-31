import React, { useState, useEffect } from 'react';
import axios from 'axios';

export default function Meals() {
  const [mealData, setMealData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentHour, setCurrentHour] = useState(new Date().getHours());

  // Helper para calcular el YYYY-MM-DD local exacto del celular
  const getClientDateString = () => {
    const tzoffset = (new Date()).getTimezoneOffset() * 60000;
    return (new Date(Date.now() - tzoffset)).toISOString().split('T')[0];
  };

  const fetchTodayMeals = () => {
    const clientDate = getClientDateString();
    axios.post('http://localhost:3000/api/meals/today', { clientDate })
      .then(res => {
        setMealData(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchTodayMeals();
    const timer = setInterval(() => setCurrentHour(new Date().getHours()), 60000);
    return () => clearInterval(timer);
  }, []);

  const handleServePortion = () => {
    const clientDate = getClientDateString();
    axios.post('http://localhost:3000/api/meals/serve-portion', {
      clientDate,
      clientHour: currentHour
    })
    .then(res => setMealData(res.data))
    .catch(err => alert(err.response?.data || 'Error'));
  };

  const handleCheckWater = () => {
    const clientDate = getClientDateString();
    axios.post('http://localhost:3000/api/meals/check-water', {
      clientDate,
      clientHour: currentHour
    })
    .then(res => setMealData(res.data))
    .catch(err => alert(err.response?.data || 'Error'));
  };

  if (loading) return <div className="text-center p-10 text-slate-400">Sincronizando raciones alimentarias...</div>;

  const foodSchedule = [
    { id: 'portion_1', name: '🍱 Porción 1 (Madrugón)', start: 6, end: 9, label: '06:00 AM - 09:00 AM', value: mealData?.portion_1 },
    { id: 'portion_2', name: '🍗 Porción 2 (Media Mañana)', start: 11, end: 14, label: '11:00 AM - 02:00 PM', value: mealData?.portion_2 },
    { id: 'portion_3', name: '🐟 Porción 3 (Tarde)', start: 16, end: 19, label: '04:00 PM - 07:00 PM', value: mealData?.portion_3 },
    { id: 'portion_4', name: '🥩 Porción 4 (Cena Nocturna)', start: 21, end: 24, label: '09:00 PM - 11:59 PM', value: mealData?.portion_4 },
  ];

  const waterSchedule = [
    { id: 'water_check_1', name: '💧 Inspección Mañana', start: 6, end: 12, label: '06:00 AM - 12:00 PM', value: mealData?.water_check_1 },
    { id: 'water_check_2', name: '💧 Inspección Tarde', start: 13, end: 19, label: '01:00 PM - 07:00 PM', value: mealData?.water_check_2 },
    { id: 'water_check_3', name: '💧 Inspección Noche', start: 20, end: 24, label: '08:00 PM - 11:59 PM', value: mealData?.water_check_3 },
  ];

  const portionsServed = foodSchedule.filter(i => i.value).length;
  const waterChecksDone = waterSchedule.filter(i => i.value).length;

  const getStatus = (item) => {
    if (item.value) return 'SUCCESS';
    if (currentHour >= item.start && currentHour < item.end) return 'AVAILABLE';
    if (currentHour >= item.end) return 'MISSED';
    return 'LOCKED';
  };

  const activeFood = foodSchedule.find(i => currentHour >= i.start && currentHour < i.end && !i.value);
  const activeWater = waterSchedule.find(i => currentHour >= i.start && currentHour < i.end && !i.value);

  return (
    <div className="w-full max-w-md mx-auto space-y-6 animate-fadeIn pb-12">
      <div className="text-center">
        <h2 className="text-3xl font-black text-slate-900 tracking-tight">🍲 Nutrición e Hidratación</h2>
        <p className="text-slate-400 text-sm mt-1">Modo Producción Internacional 📱</p>
      </div>

      <div className="bg-white p-5 rounded-3xl shadow-xl border border-slate-100 grid grid-cols-2 gap-4">
        <div className="text-center p-3 bg-orange-50/50 rounded-2xl border border-orange-100">
          <p className="text-[10px] font-bold text-orange-600 uppercase">Comida Servida</p>
          <p className="text-2xl font-black text-orange-950 mt-1">{portionsServed} / 4</p>
        </div>
        <div className="text-center p-3 bg-sky-50/50 rounded-2xl border border-sky-100">
          <p className="text-[10px] font-bold text-sky-600 uppercase">Aguas Revisadas</p>
          <p className="text-2xl font-black text-sky-950 mt-1">{waterChecksDone} / 3</p>
        </div>
      </div>

      {/* CRONOGRAMA COMIDA */}
      <div className="bg-white p-5 rounded-3xl shadow-xl border border-slate-100 space-y-3">
        <h3 className="font-bold text-slate-800 text-xs uppercase tracking-wider">🥩 Cronograma de Alimentación</h3>
        <div className="space-y-2">
          {foodSchedule.map(item => {
            const status = getStatus(item);
            return (
              <div key={item.id} className={`p-3 rounded-2xl border flex justify-between items-center text-xs ${
                status === 'SUCCESS' ? 'bg-emerald-50 border-emerald-100 text-emerald-800' :
                status === 'AVAILABLE' ? 'bg-orange-50 border-orange-300 text-orange-950 font-black animate-pulse' :
                status === 'MISSED' ? 'bg-rose-50 border-rose-100 text-rose-800' : 'bg-slate-50 text-slate-400 opacity-60'
              }`}>
                <div>
                  <p className="font-bold">{item.name}</p>
                  <p className="text-[10px] opacity-75">{item.label}</p>
                </div>
                <span className="font-bold px-2 py-0.5 rounded-lg bg-white/70 shadow-sm">
                  {status === 'SUCCESS' ? '✅ Listo' : status === 'AVAILABLE' ? '⚡ Toca' : status === 'MISSED' ? '🤡 Falta' : '🔒 Esperar'}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* CRONOGRAMA AGUA */}
      <div className="bg-white p-5 rounded-3xl shadow-xl border border-slate-100 space-y-3">
        <h3 className="font-bold text-slate-800 text-xs uppercase tracking-wider">💧 Control de Agua Fresca</h3>
        <div className="space-y-2">
          {waterSchedule.map(item => {
            const status = getStatus(item);
            return (
              <div key={item.id} className={`p-3 rounded-2xl border flex justify-between items-center text-xs ${
                status === 'SUCCESS' ? 'bg-emerald-50 border-emerald-100 text-emerald-800' :
                status === 'AVAILABLE' ? 'bg-sky-50 border-sky-300 text-sky-950 font-black' :
                'bg-slate-50 text-slate-400 opacity-60'
              }`}>
                <div>
                  <p className="font-bold">{item.name}</p>
                  <p className="text-[10px] opacity-75">{item.label}</p>
                </div>
                <span className="font-bold px-2 py-0.5 rounded-lg bg-white/70 shadow-sm">
                  {status === 'SUCCESS' ? '🧼 Óptimo' : status === 'AVAILABLE' ? '👀 Revisar' : '🔒 Esperar'}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* ACCIONES */}
      <div className="space-y-2">
        <button
          disabled={!activeFood}
          onClick={handleServePortion}
          className={`w-full p-4 rounded-2xl text-xs font-black transition-all shadow-md ${
            activeFood ? 'bg-orange-500 text-white hover:bg-orange-600 active:scale-95' : 'bg-slate-200 text-slate-400 cursor-not-allowed'
          }`}
        >
          {activeFood ? `🍲 Despachar ${activeFood.name}` : '🔒 No hay ventana de comida activa'}
        </button>

        <button
          disabled={!activeWater}
          onClick={handleCheckWater}
          className={`w-full p-4 rounded-2xl text-xs font-black transition-all shadow-md ${
            activeWater ? 'bg-sky-500 text-white hover:bg-sky-600 active:scale-95' : 'bg-slate-200 text-slate-400 cursor-not-allowed'
          }`}
        >
          {activeWater ? `💧 Confirmar Inspección de Agua` : '🔒 No requiere inspección de agua ahora'}
        </button>
      </div>
    </div>
  );
}