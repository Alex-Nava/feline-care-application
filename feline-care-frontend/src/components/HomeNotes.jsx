import React, { useState } from 'react';
import axios from 'axios';

export default function HomeNotes({ notes, onNoteAdded }) {
  const [userName, setUserName] = useState('Alex'); // Nombre por defecto
  const [content, setContent] = useState('');
  const [category, setCategory] = useState('general');
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!content.trim()) return;

    setLoading(false);
    
    // Enviamos la nueva nota al backend
    axios.post('http://localhost:3000/api/notes', {
      user_name: userName,
      content: content,
      category: category
    })
    .then(() => {
      setContent(''); // Limpiamos el cuadro de texto
      onNoteAdded();  // Le avisamos a App.jsx que recargue la lista de notas
    })
    .catch(err => console.error("Error al publicar nota:", err));
  };

  return (
    <div className="w-full max-w-md mx-auto space-y-4">
      
      {/* Mini Formulario para Crear Nota */}
      <form onSubmit={handleSubmit} className="bg-white p-4 rounded-3xl shadow-lg border border-slate-100 space-y-3">
        <h4 className="font-bold text-slate-800 text-sm flex items-center gap-1">
          ✍️ Dejar un aviso en la casa
        </h4>
        
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Ej: Ya le di de comer a Mochi, no le den doble... 🐾"
          className="w-full text-sm p-3 bg-slate-50 rounded-2xl border-none focus:ring-2 focus:ring-orange-400 outline-none resize-none h-20 text-slate-700"
          required
        />

        <div className="flex justify-between items-center gap-2">
          {/* Selector de categoría */}
          <select 
            value={category} 
            onChange={(e) => setCategory(e.target.value)}
            className="text-xs bg-slate-100 text-slate-600 p-2 rounded-xl border-none outline-none font-medium"
          >
            <option value="general">📌 General</option>
            <option value="gato">🐱 Sobre el Gato</option>
            <option value="urgente">🚨 Urgente</option>
          </select>

          {/* Botón de enviar */}
          <button
            type="submit"
            className="bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs px-4 py-2 rounded-xl transition-all shadow-md active:scale-95"
          >
            Publicar
          </button>
        </div>
      </form>

      {/* El Tablón de Anuncios (Listado) */}
      <div className="p-4 bg-orange-50 rounded-3xl shadow-sm border border-orange-100/50">
        <div className="flex justify-between items-center mb-3">
          <h3 className="font-bold text-base text-orange-950 flex items-center gap-1">
            📌 Notas de la Casa
          </h3>
          <span className="text-xs bg-orange-200 text-orange-800 px-2 py-0.5 rounded-full font-semibold">
            {notes.length} avisos
          </span>
        </div>

        <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
          {notes.length === 0 ? (
            <p className="text-xs text-gray-500 text-center italic py-4">No hay notas hoy. ¡Todo está tranquilo!</p>
          ) : (
            notes.map((note) => {
              const isGato = note.category === 'gato';
              const isUrgente = note.category === 'urgente';
              
              return (
                <div 
                  key={note.id} 
                  className={`p-3 rounded-2xl border transition-all shadow-sm ${
                    isUrgente
                      ? 'bg-red-50 border-red-200 text-red-950'
                      : isGato 
                        ? 'bg-amber-100/70 border-amber-200 text-amber-950' 
                        : 'bg-white border-slate-100 text-slate-800'
                  }`}
                >
                  <p className="text-sm font-medium leading-relaxed">{note.content}</p>
                  <div className="flex justify-between items-center mt-2 pt-1 border-t border-black/5 text-[10px] opacity-75">
                    <span className="font-bold">👤 {note.user_name}</span>
                    <span>{new Date(note.created_at).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

    </div>
  );
}