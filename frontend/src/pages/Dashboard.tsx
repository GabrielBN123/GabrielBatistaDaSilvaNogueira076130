import { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { PetFacade, type Pet } from '@/facades/PetFacade';
import { useAuth } from '@/context/AuthContext';
import { Header } from '@/components/ui/header';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { PetCard, PetCardSkeleton } from '@/components/dashboard/pet-card';
import { CustomPagination } from '@/components/ui/custom-pagination';
import { EmptyState } from '@/components/ui/empty-state';
import { 
    Search, 
    Plus, 
    Users, 
    PawPrint, 
    Dog, 
    AlertCircle, 
    Loader2 
} from 'lucide-react';

export function Dashboard() {
    const { signOut } = useAuth();
    const navigate = useNavigate();

    // Estados
    const [pets, setPets] = useState<Pet[]>([]);
    const [loading, setLoading] = useState(true);
    const [nome, setNome] = useState('');
    const [raca, setRaca] = useState(''); // Mantido caso queira expandir o filtro futuramente
    const [page, setPage] = useState(0);
    const [total, setTotal] = useState(0);
    const [pageCount, setPageCount] = useState(0);
    const ITENS_POR_PAGINA = 10;
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        carregarDados();
    }, [page, nome, raca]);

    async function carregarDados() {
        setLoading(true);
        try {
            const { data, total } = await PetFacade.getAll(nome, page, raca, ITENS_POR_PAGINA);
            
            const listaPets = data.content ? data.content : data;
            setPets(listaPets);
            setPageCount(Math.ceil(total / ITENS_POR_PAGINA));
            setTotal(total);
            setError(null);
        } catch (error) {
            console.error("Erro ao buscar dados", error);
            setError("Não foi possível carregar os pets. Verifique sua conexão.");
        } finally {
            setLoading(false);
        }
    }

    const handlePageChange = useCallback((newPage: number) => {
        if (newPage >= 0 && newPage < pageCount) {
            setPage(newPage);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    }, [pageCount]);

    const handleSearch = (val: string) => {
        setNome(val);
        setPage(0);
    };

    // Navegação
    const handleNovoPet = () => navigate('/pets/novo');
    const handleListarTutores = () => navigate('/tutores');
    const handlePetClick = (id: number) => navigate(`/pets/${id}`);

    return (
        <div className="min-h-screen min-w-screen bg-gradient-to-b from-amber-100 to-orange-200 dark:from-stone-950 dark:to-neutral-900 p-4 relative overflow-hidden">
            <Header userName="Tutor" onSignOut={signOut} />

            <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
                
                {/* --- Cabeçalho da Dashboard (Floating Card) --- */}
                <Card className="border-none shadow-lg bg-white/80 dark:bg-stone-900/80 backdrop-blur-sm">
                    <CardHeader className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 pb-6">
                        
                        {/* Título e Contador */}
                        <div className="space-y-1">
                            <CardTitle className="text-3xl font-bold flex items-center gap-3 text-stone-800 dark:text-stone-100">
                                <div className="p-2 bg-amber-100 dark:bg-amber-900/30 rounded-lg">
                                    <PawPrint className="w-8 h-8 text-amber-600 dark:text-amber-500" />
                                </div>
                                Gerenciamento de Pets
                            </CardTitle>
                            
                            {!loading && !error && (
                                <div className="flex items-center gap-2 pl-14">
                                    <Badge variant="secondary" className="bg-stone-100 text-stone-600 dark:bg-stone-800 dark:text-stone-300">
                                        Total: {total}
                                    </Badge>
                                    <span className="text-sm text-muted-foreground">
                                        {total === 1 ? "pet cadastrado" : "pets cadastrados"}
                                    </span>
                                </div>
                            )}
                        </div>

                        {/* Botões de Ação */}
                        <div className="flex items-center gap-3 w-full md:w-auto">
                            <Button
                                variant="outline" 
                                onClick={handleListarTutores} 
                                className="flex-1 md:flex-none gap-2 border-amber-300 text-amber-900 hover:bg-amber-50 dark:border-stone-700 dark:text-stone-200 dark:hover:bg-stone-800"
                            >
                                <Users className="w-4 h-4" />
                                Tutores
                            </Button>
                            
                            <Button 
                                onClick={handleNovoPet} 
                                className="flex-1 md:flex-none gap-2 bg-primary hover:bg-primary/90 text-primary-foreground shadow-md shadow-amber-900/10"
                            >
                                <Plus className="w-5 h-5" />
                                Novo Pet
                            </Button>
                        </div>
                    </CardHeader>

                    <CardContent>
                        {/* Barra de Busca Estilizada */}
                        <div className="relative max-w-md w-full">
                            <Input
                                label="Buscar Pet"
                                type="text"
                                value={nome}
                                onChange={handleSearch}
                                placeholder="Pesquise por nome..."
                                icon={Search}
                            />
                        </div>
                    </CardContent>
                </Card>

                {/* --- Grid de Conteúdo --- */}
                <div className="min-h-[400px]">
                    {loading && (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {Array.from({ length: ITENS_POR_PAGINA }).map((_, index) => (
                                <PetCardSkeleton key={`skeleton-${index}`} />
                            ))}
                        </div>
                    )}

                    {!loading && error && (
                        <Card className="bg-white/50 dark:bg-stone-900/50 backdrop-blur border-none">
                            <EmptyState
                                icon={<AlertCircle className="w-12 h-12 text-red-400" />}
                                title="Ops! Algo deu errado"
                                description={error}
                                action={
                                    <Button 
                                        variant="link" 
                                        onClick={carregarDados}
                                        className="text-primary font-bold mt-2"
                                    >
                                        Tentar novamente
                                    </Button>
                                }
                            />
                        </Card>
                    )}

                    {!loading && !error && pets.length === 0 && (
                        <Card className="bg-white/50 dark:bg-stone-900/50 backdrop-blur border-none py-12">
                            <EmptyState
                                icon={<Dog className="w-16 h-16 text-stone-300 dark:text-stone-600 mb-4" />}
                                title={nome ? "Nenhum resultado encontrado" : "Sua lista está vazia"}
                                description={nome 
                                    ? `Não encontramos nenhum pet com o nome "${nome}".` 
                                    : "Comece cadastrando seu primeiro pet para gerenciá-lo aqui."
                                }
                                action={
                                    !nome && (
                                        <Button onClick={handleNovoPet} variant="outline" className="mt-4">
                                            Cadastrar agora
                                        </Button>
                                    )
                                }
                            />
                        </Card>
                    )}

                    {!loading && !error && pets.length > 0 && (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-in fade-in duration-500">
                            {pets.map((pet) => (
                                // Wrapper para tornar o card clicável e adicionar efeitos de hover
                                <div 
                                    key={pet.id}
                                    onClick={() => handlePetClick(pet.id)}
                                    className="cursor-pointer transition-all duration-300 hover:scale-[1.02] hover:-translate-y-1 group"
                                    role="button"
                                    tabIndex={0}
                                    onKeyDown={(e) => e.key === 'Enter' && handlePetClick(pet.id)}
                                >
                                    <PetCard pet={pet} />
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* --- Paginação --- */}
                {!loading && !error && pageCount > 1 && (
                    <div className="flex justify-center pb-8 pt-4">
                        <Card className="inline-block px-6 py-4 bg-white/90 dark:bg-stone-900/90 shadow-lg border-none backdrop-blur-sm">
                            <CustomPagination
                                currentPage={page}
                                totalPages={pageCount}
                                onPageChange={handlePageChange}
                            />
                            <p className="text-center text-xs text-muted-foreground mt-3 font-medium">
                                Página {page + 1} de {pageCount}
                            </p>
                        </Card>
                    </div>
                )}
            </main>
        </div>
    );
}