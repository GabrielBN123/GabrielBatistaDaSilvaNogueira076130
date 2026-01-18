import { useEffect, useState } from 'react';
import { TutorFacade, type Tutor } from '../services/TutorFacade';
import { useAuth } from '../context/AuthContext';

export function Dashboard() {
  const { user, signOut } = useAuth(); // Pegamos o usuário logado
  const [tutores, setTutores] = useState<Tutor[]>([]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const data = await TutorFacade.getAll();
      setTutores(data);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen min-w-screen bg-gray-50">
      {/* Barra de Topo */}
      <header className="bg-white shadow p-4 flex justify-between items-center">
        <div>
          <h1 className="text-xl font-bold text-gray-800">Sistema Seletivo</h1>
          <p className="text-sm text-gray-500">Bem-vindo, {user?.name}</p>
        </div>
        <button 
          onClick={signOut}
          className="text-red-600 border border-red-200 px-3 py-1 rounded hover:bg-red-50"
        >
          Sair
        </button>
      </header>

      {/* Conteúdo Principal */}
      <main className="p-8 max-w-4xl mx-auto">
        <h2 className="text-2xl font-bold mb-4">Gerenciar Tutores</h2>
        <div className="bg-white rounded shadow p-6">
          {/* Aqui você vai evoluir para a tabela completa depois */}
          <p className="mb-4 text-gray-600">Total de registros: {tutores.length}</p>
          
          <ul className="divide-y">
            {tutores.map(t => (
              <li key={t.id} className="py-3 flex justify-between">
                <span>{t.nome}</span>
                <span className="text-gray-400">{t.email}</span>
              </li>
            ))}
          </ul>
        </div>
      </main>
    </div>
  );
}