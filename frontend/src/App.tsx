import { useEffect, useState } from 'react';
import { TutorFacade, type Tutor } from './services/TutorFacade';

function App() {
  const [tutores, setTutores] = useState<Tutor[]>([]);

  // Carrega dados ao iniciar
  useEffect(() => {
    carregarTutores();
  }, []);

  const carregarTutores = async () => {
    try {
      const dados = await TutorFacade.getAll();
      setTutores(dados);
    } catch (error) {
      alert('Erro ao buscar tutores');
    }
  };

  // Função para testar a criação (POST)
  const criarTutorTeste = async () => {
    const novoNome = prompt('Nome do novo tutor:');
    if (!novoNome) return;

    try {
      await TutorFacade.create({
        nome: novoNome,
        email: `${novoNome.toLowerCase().replace(/\s/g, '')}@teste.com`
      });
      // Recarrega a lista para mostrar o novo item
      carregarTutores(); 
    } catch (error) {
      alert('Erro ao criar tutor');
    }
  };

  const deletarTutor = async (id: number) => {
    if(!confirm('Tem certeza?')) return;
    await TutorFacade.delete(id);
    carregarTutores();
  }

  return (
    <div className="p-8 max-w-2xl mx-auto font-sans">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Gestão de Tutores</h1>
        <button 
          onClick={criarTutorTeste}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          + Adicionar Tutor
        </button>
      </div>

      <div className="border rounded shadow-sm">
        {tutores.map((tutor) => (
          <div key={tutor.id} className="p-4 border-b last:border-b-0 flex justify-between items-center">
            <div>
              <p className="font-bold">{tutor.nome}</p>
              <p className="text-sm text-gray-500">{tutor.email}</p>
            </div>
            <button 
              onClick={() => deletarTutor(tutor.id)}
              className="text-red-600 hover:text-red-800 text-sm"
            >
              Excluir
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;