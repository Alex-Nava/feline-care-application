import { useState, useEffect } from 'react';
import axios from 'axios';
import CatForm from './CatForm';

function App() {
  const [cats, setCats] = useState([]);

  const fetchCats = () => {
    axios.get('http://localhost:3000/api/cats')
      .then(response => setCats(response.data.data))
      .catch(error => console.error(error));
  };

  useEffect(() => { fetchCats(); }, []);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center py-10 px-4">
      <header className="mb-10 text-center">
        <h1 className="text-5xl font-extrabold text-slate-900 tracking-tight">🐱 Feline Care</h1>
        <p className="text-slate-500 mt-2">Gestión inteligente de felinos</p>
      </header>
      
      <CatForm onCatAdded={fetchCats} />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-5xl">
        {cats.map(cat => ( 
          <div key={cat.id} className="bg-white p-6 rounded-3xl shadow-xl border border-slate-100 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
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

export default App;