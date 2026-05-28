import { useState } from 'react';
import axios from 'axios';

function CatForm({ onCatAdded }) {
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [breed, setBreed] = useState('');
  // 1. Declaramos el nuevo estado para manejar la carga
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    // 2. Activamos el estado de carga antes de la petición
    setLoading(true); 
    
    try {
      await axios.post('http://localhost:3000/api/cats', { name, age, breed });
      setName('');
      setAge('');
      setBreed('');
      onCatAdded();
    } catch (error) {
      console.error("Error al guardar el gatito:", error);
    } finally {
      // 3. Desactivamos el estado de carga al finalizar (sea éxito o error)
      setLoading(false); 
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 w-full max-w-sm mb-8">
      <input 
        type="text" placeholder="Nombre del gatito" value={name} onChange={(e) => setName(e.target.value)}
        className="w-full p-2 mb-3 border rounded-lg" required
      />
      <input 
        type="number" placeholder="Edad" value={age} onChange={(e) => setAge(e.target.value)}
        className="w-full p-2 mb-4 border rounded-lg" required
      />
      <input 
  type="text" placeholder="Raza (ej: Siames, Persa)" value={breed} 
  onChange={(e) => setBreed(e.target.value)}
  className="w-full p-2 mb-4 border rounded-lg" required
/>
      {/* 4. Aplicamos el estado de carga al botón */}
      <button 
        type="submit" 
        disabled={loading} 
        className={`w-full py-2 rounded-lg font-bold transition-all ${loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 text-white'}`}
      >
        {loading ? 'Registrando...' : 'Registrar Gatito'}
      </button>
    </form>
  );
}

export default CatForm;