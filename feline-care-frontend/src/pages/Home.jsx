import { useState, useEffect } from 'react';
import axios from 'axios';
import CatForm from '../CatForm'; // Subimos un nivel con '../' porque estamos dentro de /pages
import HomeNotes from '../components/HomeNotes';

export default function Home() {
  const [cats, setCats] = useState([]);
  const [notes, setNotes] = useState([]);

  const fetchCats = () => {
    axios.get('http://localhost:3000/api/cats')
      .then(response => setCats(response.data.data))
      .catch(error => console.error(error));
  };

  const fetchNotes = () => {
    axios.get('http://localhost:3000/api/notes')
      .then(response => setNotes(response.data))
      .catch(error => console.error('Error al traer notas:', error));
  };

  useEffect(() => { 
    fetchCats(); 
    fetchNotes(); 
  }, []);

  return (
    <div className="w-full flex flex-col items-center">
      <header className="mb-8 text-center">
        <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">🐱 Feline Care</h1>
        <p className="text-slate-500 mt-1">Gestión inteligente de felinos</p>
      </header>
      
      {/* Tablón de Notas de la Casa */}
      <div className="w-full max-w-md mb-6">
        <HomeNotes notes={notes} onNoteAdded={fetchNotes} />
      </div>

      <CatForm onCatAdded={fetchCats} />

      {/* Grid de Gatos */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-5xl mt-8">
        {cats.map(cat => ( 
          <div key={cat.id} className="bg-white p-6 rounded-3xl shadow-xl border border-slate-100 transition-all duration-300">
            <div className="w-12 h-12 bg-blue-100 rounded-2xl flex items-center justify-center mb-4 text-2xl">🐱</div>
            <h2 className="text-2xl font-bold text-slate-800">{cat.name}</h2>
            <div className="flex gap-2 mt-2">
              <p className="text-slate-400 font-medium">Edad: {cat.age} años</p>
              <span className="text-slate-300">|</span>
              <p className="text-blue-600 font-semibold">{cat.breed || 'Sin raza'}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}