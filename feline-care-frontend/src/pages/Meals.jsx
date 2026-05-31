import React, { useState, useEffect } from 'react';
import axios from 'axios';

export default function Meals() {
  const [todayMeals, setTodayMeals] = useState([]);
  const [loading, setLoading] = useState(false);

  // 1. Cargar las comidas consumidas HOY desde el backend
  const fetchTodayMeals = () => {
    axios.get('http://localhost:3000/api/meals/today')
      .then(res => setTodayMeals(res.data))
      .catch(err => console.error('Error al traer comidas de hoy:', err));
  };

  useEffect(() => {
    fetchTodayMeals();
  }, []);

  // 2. Función para registrar comida o agua al hacer clic
  const handleRegisterMeal = (portion, waterMl = 0) => {
    axios.post('http://localhost:3000/api/meals', {
      portion_type: portion,
      water_ml: waterMl,
      served_by: 'Alex' // Reemplazable dinámicamente más adelante
    })
    .then(() => {
      fetchTodayMeals(); // Recargamos la info para actualizar los medidores en pantalla
    })
    .catch(err => console.error('Error al guardar comida:', err));
  };

  // 3. Cálculos dinámicos basados en lo que viene de la BD
  const breakfastDone = todayMeals.some(m => m.portion_type === 'Desayuno');
  const lunchDone = todayMeals.some(m => m.portion_type === 'Almuerzo');
  const dinnerDone = todayMeals.some(m => m.portion_type === 'Cena');

  // Sumar los ml de agua registrados hoy
  const totalWater = todayMeals.reduce((acc, curr) => acc + curr.water_ml, 0);
  const waterGoal = 250; // Meta diaria de agua para un gato (en ml)
  const waterPercentage = Math.min(Math.round((totalWater / waterGoal) * 100), 100);

  // Calcular porcentaje total de alimentación diaria (3 comidas = 100%)
  const mealsCount = [breakfastDone, lunchDone, dinnerDone].filter(Boolean).length;
  const foodPercentage = Math.round((mealsCount / 3) * 100);

  return (
    <div className="w-full max-w-md mx-auto space-y-6 animate-fadeIn">
      
      {/* Encabezado */}
      <div className="text-center">
        <h2 className="text-3xl font-black text-slate-900 tracking-tight">🍲 Alimentación</h2>
        <p className="text-slate-400 text-sm mt-1">Control diario de porciones y agua</p>
      </div>

      {/* Tarjeta de Progreso General (Estilo Circular/Barra Figma) */}
      <div className="bg-white p-5 rounded-3xl shadow-xl border border-slate-100 space-y-4">
        <h3 className="font-bold text-slate-800 text-sm flex items-center gap-1">
          📊 Resumen de hoy
        </h3>
        
        {/* Barra de Progreso de Comida */}
        <div className="space-y-1.5">
          <div className="flex justify-between text-xs font-semibold text-slate-500">
            <span>Comida diaria servida</span>
            <span className="text-orange-600 font-bold">{foodPercentage}%</span>
          </div>
          <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden">
            <div 
              className="bg-orange-500 h-full transition-all duration-500 rounded-full"
              style={{ width: `${foodPercentage}%` }}
            />
          </div>
        </div>

        {/* Barra de Progreso de Agua */}
        <div className="space-y-1.5 pt-1">
          <div className="flex justify-between text-xs font-semibold text-slate-500">
            <span>Hidratación ({totalWater}ml / {waterGoal}ml)</span>
            <span className="text-blue-600 font-bold">{waterPercentage}%</span>
          </div>
          <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden">
            <div 
              className="bg-blue-500 h-full transition-all duration-500 rounded-full"
              style={{ width: `${waterPercentage}%` }}
            />
          </div>
        </div>
      </div>

      {/* Sección 1: Registro de Porciones de Comida */}
      <div className="space-y-3">
        <h3 className="font-bold text-slate-700 text-sm pl-1">🍽️ Porciones programadas</h3>
        
        <div className="grid grid-cols-1 gap-2.5">
          {/* Botón Desayuno */}
          <button
            onClick={() => !breakfastDone && handleRegisterMeal('Desayuno')}
            disabled={breakfastDone}
            className={`w-full p-4 rounded-2xl border text-left flex justify-between items-center transition-all ${
              breakfastDone 
                ? 'bg-emerald-50 border-emerald-200 text-emerald-800 cursor-not-allowed'
                : 'bg-white border-slate-100 text-slate-800 hover:border-orange-200 active:scale-[0.99]'
            }`}
          >
            <div className="flex items-center gap-3">
              <span className="text-2xl">🌅</span>
              <div>
                <p className="font-bold text-sm">Desayuno</p>
                <p className="text-xs text-slate-400">{breakfastDone ? 'Ya fue servido' : 'Pendiente por servir'}</p>
              </div>
            </div>
            <span className={`text-sm font-bold ${breakfastDone ? 'text-emerald-600' : 'text-slate-300'}`}>
              {breakfastDone ? '✅ Servido' : 'Marcar'}
            </span>
          </button>

          {/* Botón Almuerzo */}
          <button
            onClick={() => !lunchDone && handleRegisterMeal('Almuerzo')}
            disabled={lunchDone}
            className={`w-full p-4 rounded-2xl border text-left flex justify-between items-center transition-all ${
              lunchDone 
                ? 'bg-emerald-50 border-emerald-200 text-emerald-800 cursor-not-allowed'
                : 'bg-white border-slate-100 text-slate-800 hover:border-orange-200 active:scale-[0.99]'
            }`}
          >
            <div className="flex items-center gap-3">
              <span className="text-2xl">☀️</span>
              <div>
                <p className="font-bold text-sm">Almuerzo</p>
                <p className="text-xs text-slate-400">{lunchDone ? 'Ya fue servido' : 'Pendiente por servir'}</p>
              </div>
            </div>
            <span className={`text-sm font-bold ${lunchDone ? 'text-emerald-600' : 'text-slate-300'}`}>
              {lunchDone ? '✅ Servido' : 'Marcar'}
            </span>
          </button>

          {/* Botón Cena */}
          <button
            onClick={() => !dinnerDone && handleRegisterMeal('Cena')}
            disabled={dinnerDone}
            className={`w-full p-4 rounded-2xl border text-left flex justify-between items-center transition-all ${
              dinnerDone 
                ? 'bg-emerald-50 border-emerald-200 text-emerald-800 cursor-not-allowed'
                : 'bg-white border-slate-100 text-slate-800 hover:border-orange-200 active:scale-[0.99]'
            }`}
          >
            <div className="flex items-center gap-3">
              <span className="text-2xl">🌌</span>
              <div>
                <p className="font-bold text-sm">Cena</p>
                <p className="text-xs text-slate-400">{dinnerDone ? 'Ya fue servido' : 'Pendiente por servir'}</p>
              </div>
            </div>
            <span className={`text-sm font-bold ${dinnerDone ? 'text-emerald-600' : 'text-slate-300'}`}>
              {dinnerDone ? '✅ Servido' : 'Marcar'}
            </span>
          </button>
        </div>
      </div>

      {/* Sección 2: Registro Rápido de Agua */}
      <div className="space-y-3">
        <h3 className="font-bold text-slate-700 text-sm pl-1">💧 Añadir agua bebida</h3>
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={() => handleRegisterMeal('Agua', 50)}
            className="bg-blue-50 hover:bg-blue-100 border border-blue-100 text-blue-900 font-bold p-3 rounded-2xl transition-all text-xs flex flex-col items-center gap-1 active:scale-95 shadow-sm"
          >
            <span className="text-xl">💧</span>
            <span>+50 ml (Vasito)</span>
          </button>
          <button
            onClick={() => handleRegisterMeal('Agua', 100)}
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold p-3 rounded-2xl transition-all text-xs flex flex-col items-center gap-1 active:scale-95 shadow-md"
          >
            <span className="text-xl">🥛</span>
            <span>+100 ml (Tazón)</span>
          </button>
        </div>
      </div>

    </div>
  );
}