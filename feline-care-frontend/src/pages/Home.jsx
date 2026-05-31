import React, { useState, useEffect } from 'react';
import axios from 'axios';
import HomeNotes from '../components/HomeNotes';
import PetsManager from './PetsManager';

export default function Home() { // Ya no recibimos notes por props, las gestionamos aquí mismo
  const [currentPet, setCurrentPet] = useState(null);
  const [notes, setNotes] = useState([]); // Este es el estado maestro de las notas

  // Traer las notas globales del tablón de la casa
  const fetchNotes = () => {
    const householdId = localStorage.getItem('householdId') || '1';

    axios.get('http://localhost:3000/api/notes', {
      params: { householdId: householdId },
      headers: { 'household-id': householdId }
    })
      .then(response => {
        setNotes(response.data); // Actualizamos el estado maestro
      })
      .catch(error => {
        console.error('Error al traer notas:', error);
      });
  };

  useEffect(() => { 
    fetchNotes(); 
  }, []);

  return (
    <div className="w-full flex flex-col items-center space-y-6">
      
      {/* 1. Encabezado */}
      <header className="text-center w-full">
        <h1 className="text-3xl font-black text-slate-900 tracking-tight flex items-center justify-center gap-2">
          <span>🐾</span> Feline & Canine Care
        </h1>
        <p className="text-slate-400 text-xs mt-0.5 uppercase tracking-wider font-bold">
          Gestión inteligente del hogar
        </p>
      </header>

      {/* 2. Registro de Mascotas */}
      <div className="w-full max-w-md">
        <PetsManager 
          selectedPetId={currentPet?.id} 
          onPetSelected={(pet) => setCurrentPet(pet)} 
        />
      </div>

      {/* 3. Panel de Contexto */}
      <div className="w-full max-w-md">
        {currentPet ? (
          <div className="space-y-4 animate-fadeIn">
            <div className="bg-slate-900 text-white p-5 rounded-3xl shadow-xl flex justify-between items-center border border-slate-800">
              <div>
                <p className="text-[10px] uppercase tracking-wider font-bold text-slate-400">Panel activo de:</p>
                <h2 className="text-2xl font-black tracking-tight">{currentPet.name} {currentPet.type === 'CAT' || currentPet.type === 'Gato' ? '🐱' : '🐶'}</h2>
              </div>
              <span className="text-xs font-bold px-3 py-1 bg-white/10 rounded-full border border-white/10 backdrop-blur-sm">
                {currentPet.gender === 'MALE' || currentPet.gender === 'Machito' ? 'Macho ♂' : 'Hembra ♀'}
              </span>
            </div>
          </div>
        ) : (
          <div className="text-center text-slate-400 text-xs py-6 bg-white border border-slate-100/80 rounded-3xl font-medium shadow-sm">
            🔒 Selecciona un heredero en el carrusel de arriba para abrir sus bitácoras.
          </div>
        )}
      </div>
      
      {/* 4. Tablón de Notas (CONECTADO) */}
      <div className="w-full max-w-md">
        <div className="bg-white p-1 rounded-3xl shadow-sm border border-slate-100/80">
          {/* Aquí le pasamos el estado 'notes' y la función 'fetchNotes' para refrescar */}
          <HomeNotes notes={notes} onNoteAdded={fetchNotes} />
        </div>
      </div>

    </div>
  );
}