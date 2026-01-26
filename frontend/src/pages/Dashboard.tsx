import { useEffect, useState, useCallback, type ChangeEvent } from 'react';
// import { TutorFacade, type Tutor } from '../facades/TutorFacade';
import { useNavigate } from 'react-router-dom'; // Importação para navegação
import { PetFacade, type Pet } from '@/facades/PetFacade';
import { useAuth } from '@/context/AuthContext';
import { Header } from '@/components/ui/header';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { PetCard, PetCardSkeleton } from '@/components/dashboard/pet-card';
import { CustomPagination } from '@/components/ui/custom-pagination';
import { EmptyState } from '@/components/ui/empty-state';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';
import { Button } from '@/components/ui/button'; // Assumindo que você tem este componente

export function Dashboard() {
	const { user, signOut } = useAuth();
    const navigate = useNavigate(); // Hook de navegação

	// Estados para dados e paginação
	// const [tutores, setTutores] = useState<Tutor[]>([]);
	const [pets, setPets] = useState<Pet[]>([]);
	const [loading, setLoading] = useState(true);
	const [nome, setNome] = useState('');
	const [raca, setRaca] = useState('');
	const [page, setPage] = useState(0);
	const [total, setTotal] = useState(0);
	const [pageCount, setPageCount] = useState(0);
	const ITENS_POR_PAGINA = 10;
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		carregarDados();
	}, [page, nome, raca]); // Recarrega sempre que a página mudar

	async function carregarDados() {
		setLoading(true);
		try {
			const { data, total } = await PetFacade.getAll(nome, page, raca, ITENS_POR_PAGINA);

			const listaPets = data.content ? data.content : data;
			setPets(listaPets);
			setPageCount(Math.ceil(total / ITENS_POR_PAGINA));
			setTotal(total);
		} catch (error) {
			console.error("Erro ao buscar dados", error);
			setError("Não foi possível carregar os pets.");
		} finally {
			setLoading(false);
		}
	}

	const handlePageChange = useCallback(
		(newPage: number) => {
			// Validação da página
			if (newPage < 0 || newPage >= pageCount) {
				return;
			}
			setPage(newPage);
		},
		[pageCount]
	);

	// Função para lidar com a busca e resetar para página 0
	const handleSearch = (val: string) => {
		// console.log("Filtrando por nome:", e);
		setNome(val);
		setPage(0); // Volta para a primeira página ao filtrar
	};

	const handleNovoPet = () => {
        navigate('/pets/novo');
    };

    const handleListarTutores = () => {
        navigate('/tutores');
    };

	return (
		<div className="min-h-screen min-w-screen bg-gradient-to-b from-amber-100 to-orange-200 dark:from-stone-950 dark:to-neutral-900 p-4 relative overflow-hidden">
			<Header userName="Tutor" onSignOut={signOut} />

			{/* Conteúdo Principal */}
			<main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
				<Card>
					<CardHeader className="flex flex-row items-center justify-between flex-wrap gap-4">
						<div>
							<CardTitle className="text-2xl flex items-center gap-2">
								<PawIcon className="w-7 h-7 text-primary" />
								Gerenciamento de Pets
							</CardTitle>
						</div>

						{!loading && !error && (
							<Badge variant="secondary" className="text-base px-4 py-2">
								{total} {total === 1 ? "pet" : "pets"}
							</Badge>
						)}

						<div className="flex items-center gap-2 w-full md:w-auto">
							<Button
								variant="outline" onClick={handleListarTutores} className="flex-1 md:flex-none gap-2" >
								{/* <Users className="w-4 h-4" /> */}
								Tutores
							</Button>
							<Button onClick={handleNovoPet} className="flex-1 md:flex-none gap-2 bg-primary text-primary-foreground hover:bg-primary/90">
								{/* <Plus className="w-4 h-4" /> */}
								Novo Pet
							</Button>
						</div>
					</CardHeader>

					<CardContent className="space-y-4">
						{/* Área de Filtro e Badge */}
						<div className="flex items-center gap-3 w-full md:w-auto">
							<div className="relative w-full md:w-64">
								<Input
									label="Nome do Pet"
									type="text"
									value={nome}
									onChange={handleSearch}
									placeholder="Nome do Pet"
									icon={Search}
									required
								/>
								{/* <Input icon={Search} label='Nome' type='text' placeholder="Buscar pet pelo nome..." value={nome} onChange={handleSearch}/> */}
							</div>
						</div>
					</CardContent>

					<CardContent className="space-y-4">
						{loading && (
							<div className="space-y-4">
								{Array.from({ length: ITENS_POR_PAGINA }).map((_, index) => (
									<PetCardSkeleton key={`skeleton-${index}`} />
								))}
							</div>
						)}

						{!loading && error && (
							<EmptyState
								icon={<ErrorIcon className="w-10 h-10 text-destructive" />}
								title="Ops! Algo deu errado"
								description={error}
								action={
									<button
										onClick={carregarDados}
										className="text-primary font-bold hover:underline"
									>
										Tentar novamente
									</button>
								}
							/>
						)}

						{!loading && !error && pets.length === 0 && (
							<EmptyState
								icon={<SadDogIcon className="w-10 h-10 text-muted-foreground" />}
								title="Nenhum pet encontrado"
								description="Parece que você ainda não tem pets cadastrados."
							/>
						)}

						{!loading && !error && pets.length > 0 && (
							<div className="space-y-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
								{pets.map((pet) => (
									<PetCard key={pet.id} pet={pet} />
								))}
							</div>
						)}

						{!loading && !error && pageCount > 1 && (
							<div className="pt-6 border-t-4 border-border mt-6">
								<CustomPagination
									currentPage={page}
									totalPages={pageCount}
									onPageChange={handlePageChange}
								/>
								<p className="text-center text-sm text-muted-foreground mt-3">
									Página {page + 1} de {pageCount}
								</p>
							</div>
						)}
					</CardContent>
				</Card>
			</main>
		</div>
	);
}

function PawIcon({ className }: { className?: string }) {
	return (
		<svg
			xmlns="http://www.w3.org/2000/svg"
			viewBox="0 0 24 24"
			fill="currentColor"
			className={className}
			aria-hidden="true"
		>
			<path d="M12 10c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm-3.5-1c-.83 0-1.5.67-1.5 1.5S7.67 12 8.5 12s1.5-.67 1.5-1.5S9.33 9 8.5 9zm7 0c-.83 0-1.5.67-1.5 1.5s.67 1.5 1.5 1.5 1.5-.67 1.5-1.5S16.33 9 15.5 9zM12 16c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4zm-4.5-8C6.67 8 6 7.33 6 6.5S6.67 5 7.5 5 9 5.67 9 6.5 8.33 8 7.5 8zm9 0c-.83 0-1.5-.67-1.5-1.5S15.67 5 16.5 5s1.5.67 1.5 1.5S17.33 8 16.5 8z" />
		</svg>
	);
}

function SadDogIcon({ className }: { className?: string }) {
	return (
		<svg
			xmlns="http://www.w3.org/2000/svg"
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			strokeWidth="2"
			strokeLinecap="round"
			strokeLinejoin="round"
			className={className}
			aria-hidden="true"
		>
			<path d="M10 5.172C10 3.782 8.423 2.679 6.5 3c-2.823.47-4.113 6.006-4 7 .08.703 1.725 1.722 3.656 1 1.261-.472 1.96-1.45 2.344-2.5" />
			<path d="M14.267 5.172c0-1.39 1.577-2.493 3.5-2.172 2.823.47 4.113 6.006 4 7-.08.703-1.725 1.722-3.656 1-1.261-.472-1.855-1.45-2.239-2.5" />
			<path d="M8 15v.5" />
			<path d="M16 15v.5" />
			<path d="M11.25 16.25h1.5L12 17l-.75-.75Z" />
			<path d="M4.42 11.247A13.152 13.152 0 0 0 4 14.556C4 18.728 7.582 21 12 21s8-2.272 8-6.444c0-1.061-.162-2.2-.493-3.309m-9.243-6.082A8.801 8.801 0 0 1 12 5c.78 0 1.5.108 2.161.306" />
		</svg>
	);
}


function ErrorIcon({ className }: { className?: string }) {
	return (
		<svg
			xmlns="http://www.w3.org/2000/svg"
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			strokeWidth="2"
			strokeLinecap="round"
			strokeLinejoin="round"
			className={className}
			aria-hidden="true"
		>
			<circle cx="12" cy="12" r="10" />
			<line x1="12" x2="12" y1="8" y2="12" />
			<line x1="12" x2="12.01" y1="16" y2="16" />
		</svg>
	);
}