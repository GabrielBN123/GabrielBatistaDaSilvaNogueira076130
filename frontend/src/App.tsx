import { useEffect, useState } from 'react';
import { TutorFacade, type Tutor } from './services/TutorFacade';

function App() {
	const [tutores, setTutores] = useState<Tutor[]>([]);
	const [erro, setErro] = useState<string>('');

	useEffect(() => {
		// Chama o Facade ao carregar a página
		TutorFacade.getAll()
			.then(dados => setTutores(dados))
			.catch(err => {
				console.error(err);
				setErro('Erro ao conectar com a API. Verifique se o Docker está rodando.');
			});
	}, []);

	return (
		<div className="p-10 max-w-4xl mx-auto">
			<h1 className="text-3xl font-bold mb-6 text-blue-600">
				Teste do Sistema - Edital SEPLAG
			</h1>

			{erro && (
				<div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
					{erro}
				</div>
			)}

			<div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
				<h2 className="text-xl font-semibold mb-4">Lista de Tutores (Vinda da API)</h2>
				{tutores.length === 0 && !erro ? (
					<p>Carregando...</p>
				) : (
					<ul className="space-y-2">
						{tutores.map(tutor => (
							<li key={tutor.id} className="p-3 border rounded hover:bg-gray-50 flex justify-between">
								<span className="font-medium">{tutor.nome}</span>
								<span className="text-gray-500 text-sm">{tutor.email}</span>
							</li>
						))}
					</ul>
				)}
			</div>
		</div>
	);
}

export default App;