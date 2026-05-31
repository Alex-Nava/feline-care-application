import React, { useState, useEffect } from 'react';
import axios from 'axios';

export default function PetsManager({ onPetSelected, selectedPetId }) {
  const [pets, setPets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  
  // Campos del formulario
  const [name, setName] = useState('');
  const [type, setType] = useState('CAT'); // CAT | DOG
  const [gender, setGender] = useState('MALE'); // MALE | FEMALE

  // 🧼 Función auxiliar para limpiar cualquier desastre del localStorage
  const getCleanHouseholdId = () => {
    let rawId = localStorage.getItem('householdId');
    
    if (!rawId || rawId === 'undefined' || rawId === 'null' || String(rawId).trim() === '') {
      return '1'; // Respaldo por defecto
    }
    
    // Si viene con dos puntos corruptos tipo "1:1" o ":1"
    if (String(rawId).includes(':')) {
      const parts = String(rawId).split(':');
      rawId = parts[0] || parts[1] || '1';
    }
    
    // Extraer solo los números usando Regex por seguridad
    const cleanNumber = String(rawId).replace(/\D/g, '');
    return cleanNumber !== '' ? cleanNumber : '1';
  };

  const fetchPets = () => {
    const cleanId = getCleanHouseholdId();

    axios.get(`http://localhost:3000/api/pets/household/${cleanId}`)
      .then(res => {
        const petData = Array.isArray(res.data) ? res.data : (res.data.data || []);
        setPets(petData);
        
        if (petData.length > 0 && !selectedPetId) {
          onPetSelected(petData[0]);
        }
        setLoading(false);
      })
      .catch(err => {
        console.error("Error al traer las mascotas:", err);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchPets();
  }, [selectedPetId]);

  const handleAddPet = (e) => {
    e.preventDefault();
    if (!name.trim()) return;

    const cleanId = getCleanHouseholdId();

    // Si por alguna razón el ID sigue vacío, alertamos amigablemente antes de enviar
    if (!cleanId || cleanId === '0') {
      alert('Falta el ID del Hogar. Por favor, cierra sesión y vuelve a ingresar para recargar las credenciales de tu casa. 🏠');
      return;
    }

    axios.post('http://localhost:3000/api/pets/add', {
      name: name.trim(),
      type,
      gender,
      householdId: parseInt(cleanId, 10)
    })
    .then(res => {
      alert(res.data.msg || '¡Mascota añadida con éxito!');
      setShowModal(false);
      setName('');
      fetchPets(); // Recargar la lista en caliente
    })
    .catch(err => {
      console.error(err);
      alert(err.response?.data?.msg || 'Error al añadir mascota');
    });
  };

  if (loading) return <div className="text-center p-4 text-slate-400 text-xs">Cargando herederos...</div>;

  return (
    <div className="space-y-4">
      {/* Carrusel de Burbujas Superiores (Estilo Historias de Instagram) */}
      <div className="bg-white p-4 rounded-3xl shadow-md border border-slate-100/80">
        <h3 className="text-xs font-black text-slate-400 uppercase tracking-wider mb-3 px-1">Tus Jefes en este Hogar</h3>
        
        <div className="flex items-center gap-4 overflow-x-auto pb-1 scrollbar-none">
          {/* Lista de Mascotas */}
          {pets.map(pet => {
            const isSelected = pet.id === selectedPetId;
            return (
              <button
                key={pet.id}
                onClick={() => onPetSelected(pet)}
                className="flex flex-col items-center gap-1.5 focus:outline-none min-w-[65px] transition-all"
              >
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-2xl transition-all shadow-md ${
                  isSelected 
                    ? 'bg-gradient-to-tr from-orange-500 to-amber-400 text-white scale-110 border-2 border-orange-200' 
                    : 'bg-slate-100 text-slate-600 border border-slate-200/60'
                }`}>
                  {pet.type === 'CAT' || pet.type === 'Gato' ? '🐱' : '🐶'}
                </div>
                <span className={`text-[11px] truncate max-w-[65px] tracking-tight ${isSelected ? 'font-black text-orange-600' : 'font-medium text-slate-500'}`}>
                  {pet.name}
                </span>
              </button>
            );
          })}

          {/* Botón para Añadir Mascota Nueva */}
          <button
            onClick={() => setShowModal(true)}
            className="flex flex-col items-center gap-1.5 focus:outline-none min-w-[65px]"
          >
            <div className="w-14 h-14 rounded-2xl bg-slate-50 border-2 border-dashed border-slate-300 flex items-center justify-center text-slate-400 text-xl hover:border-orange-400 hover:text-orange-500 transition-all">
              ➕
            </div>
            <span className="text-[11px] font-bold text-slate-400">Añadir</span>
          </button>
        </div>
      </div>

      {/* MODAL DE REGISTRO */}
      {showModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-end sm:items-center justify-center z-50 p-4 animate-fadeIn">
          <div className="bg-white w-full max-w-sm rounded-t-[32px] sm:rounded-[32px] p-6 space-y-5 shadow-2xl border border-slate-100 animate-slideUp">
            
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-black text-slate-800">Registrar Nueva Mascota</h3>
              <button onClick={() => setShowModal(false)} className="text-slate-400 font-bold bg-slate-100 p-1.5 rounded-full text-xs w-7 h-7 flex items-center justify-center">✕</button>
            </div>

            <form onSubmit={handleAddPet} className="space-y-4">
              {/* Campo Nombre */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-500 uppercase">Nombre de la Mascota</label>
                <input 
                  type="text" required placeholder="Ej. Garfield, Firulais"
                  value={name} onChange={e => setName(e.target.value)}
                  className="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-sm focus:outline-none focus:border-orange-500 transition-all"
                />
              </div>

              {/* Selector de Especie */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-500 uppercase">Especie</label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setType('CAT')}
                    className={`p-4 rounded-2xl border flex flex-col items-center gap-1 font-black text-xs transition-all ${
                      type === 'CAT' ? 'bg-orange-50 border-orange-400 text-orange-700 shadow-inner' : 'bg-slate-50 border-slate-200 text-slate-500'
                    }`}
                  >
                    <span className="text-2xl">🐱</span> Gato
                  </button>
                  <button
                    type="button"
                    onClick={() => setType('DOG')}
                    className={`p-4 rounded-2xl border flex flex-col items-center gap-1 font-black text-xs transition-all ${
                      type === 'DOG' ? 'bg-amber-50 border-amber-400 text-amber-700 shadow-inner' : 'bg-slate-50 border-slate-200 text-slate-500'
                    }`}
                  >
                    <span className="text-2xl">🐶</span> Perro
                  </button>
                </div>
              </div>

              {/* Selector de Género */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-500 uppercase">Sexo</label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setGender('MALE')}
                    className={`p-3 rounded-2xl border font-bold text-xs transition-all ${
                      gender === 'MALE' ? 'bg-slate-900 border-slate-900 text-white' : 'bg-slate-50 border-slate-200 text-slate-500'
                    }`}
                  >
                    Machito ♂
                  </button>
                  <button
                    type="button"
                    onClick={() => setGender('FEMALE')}
                    className={`p-3 rounded-2xl border font-bold text-xs transition-all ${
                      gender === 'FEMALE' ? 'bg-slate-900 border-slate-900 text-white' : 'bg-slate-50 border-slate-200 text-slate-500'
                    }`}
                  >
                    Hembrita ♀
                  </button>
                </div>
              </div>

              <button type="submit" className="w-full bg-gradient-to-r from-orange-500 to-amber-500 text-white font-black p-4 rounded-2xl text-sm shadow-md active:scale-95 transition-all pt-3.5">
                Guardar Patrón 👑
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Si no hay ninguna mascota registrada aún en el hogar */}
      {pets.length === 0 && (
        <div className="p-8 text-center bg-orange-50/40 rounded-3xl border border-dashed border-orange-200 space-y-3">
          <p className="text-2xl">🫙</p>
          <h4 className="text-sm font-black text-slate-800">Tu hogar está extrañamente vacío</h4>
          <p className="text-xs text-slate-400 px-4">Necesitas registrar al menos un perro o gato para activar el panel logístico de raciones y alertas de salud.</p>
          <button onClick={() => setShowModal(true)} className="bg-orange-500 text-white text-xs font-black px-4 py-2.5 rounded-xl shadow-xl">
            Registrar mi Primera Mascota 🚀
          </button>
        </div>
      )}
    </div>
  );
}