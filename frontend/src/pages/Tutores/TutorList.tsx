import { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { TutorFacade } from '@/facades/TutorFacade'; // Certifique-se de ter criado este Facade
import { useAuth } from '@/context/AuthContext';
import { Header } from '@/components/ui/header';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { CustomPagination } from '@/components/ui/custom-pagination';
import { EmptyState } from '@/components/ui/empty-state';
import { Input } from '@/components/ui/input';
import { Search, Users, UserPlus, Dog } from 'lucide-react';
import { TutorCard, TutorCardSkeleton } from '@/components/dashboard/tutor-card';

// Interface local caso não tenha exportada do Facade ainda
interface Tutor {
    id: number;
    nome: string;
    email: string;
    telefone: string;
    foto?: { url: string } | null;
}

export function TutorList() {
    const { signOut } = useAuth();
    const navigate = useNavigate();

    // Estados
    const [tutores, setTutores] = useState<Tutor[]>([]);
    const [loading, setLoading] = useState(true);
    const [nome, setNome] = useState('');
    
    // Paginação
    const [page, setPage] = useState(0);
    const [total, setTotal] = useState(0);
    const [pageCount, setPageCount] = useState(0);
    const ITENS_POR_PAGINA = 10;
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        carregarDados();
    }, [page, nome]);

    async function carregarDados() {
        setLoading(true);
        try {
            // Ajuste aqui conforme os parâmetros do seu TutorFacade
            const { data, total } = await TutorFacade.getAll(nome, page, ITENS_POR_PAGINA);
            
            const lista = data.content ? data.content : data;
            setTutores(lista);
            setPageCount(Math.ceil(total / ITENS_POR_PAGINA));
            setTotal(total);
        } catch (error) {
            console.error("Erro ao buscar tutores", error);
            setError("Não foi possível carregar os tutores.");
        } finally {
            setLoading(false);
        }
    }

    const handlePageChange = useCallback((newPage: number) => {
        if (newPage < 0 || newPage >= pageCount) return;
        setPage(newPage);
    }, [pageCount]);

    const handleSearch = (val: string) => {
        setNome(val);
        setPage(0);
    };

    // Navegação
    const handleNovoTutor = () => navigate('/tutores/novo');
    const handleListarPets = () => navigate('/'); // Volta para Home/Pets

    return (
        <div className="min-h-screen min-w-screen bg-gradient-to-b from-amber-100 to-orange-200 dark:from-stone-950 dark:to-neutral-900 p-4 relative overflow-hidden">
            <Header userName="Admin" onSignOut={signOut} />

            <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between flex-wrap gap-4">
                        <div>
                            <CardTitle className="text-2xl flex items-center gap-2">
                                <Users className="w-7 h-7 text-primary" />
                                Lista de Tutores
                            </CardTitle>
                        </div>

                        {!loading && !error && (
                            <Badge variant="secondary" className="text-base px-4 py-2">
                                {total} {total === 1 ? "tutor" : "tutores"}
                            </Badge>
                        )}

                        <div className="flex items-center gap-2 w-full md:w-auto">
                            <Button 
                                variant="outline" 
                                onClick={handleListarPets} 
                                className="flex-1 md:flex-none gap-2"
                            >
                                <Dog className="w-4 h-4" />
                                Ver Pets
                            </Button>
                            <Button 
                                onClick={handleNovoTutor} 
                                className="flex-1 md:flex-none gap-2 bg-primary text-primary-foreground hover:bg-primary/90"
                            >
                                <UserPlus className="w-4 h-4" />
                                Novo Tutor
                            </Button>
                        </div>
                    </CardHeader>

                    <CardContent className="space-y-4">
                        {/* Filtro */}
                        <div className="flex items-center gap-3 w-full md:w-auto">
                            <div className="relative w-full md:w-64">
                                <Input
                                    label="Buscar Tutor"
                                    type="text"
                                    value={nome}
                                    onChange={handleSearch}
                                    placeholder="Nome, email..."
                                    icon={Search}
                                />
                            </div>
                        </div>
                    </CardContent>

                    <CardContent className="space-y-4">
                        {loading && (
                            <div className="space-y-4">
                                {Array.from({ length: ITENS_POR_PAGINA }).map((_, index) => (
                                    <TutorCardSkeleton key={`skeleton-${index}`} />
                                ))}
                            </div>
                        )}

                        {!loading && error && (
                            <EmptyState
                                icon={<ErrorIcon className="w-10 h-10 text-destructive" />}
                                title="Ops! Algo deu errado"
                                description={error}
                                action={
                                    <button onClick={carregarDados} className="text-primary font-bold hover:underline">
                                        Tentar novamente
                                    </button>
                                }
                            />
                        )}

                        {!loading && !error && tutores.length === 0 && (
                            <EmptyState
                                icon={<SadUserIcon className="w-10 h-10 text-muted-foreground" />}
                                title="Nenhum tutor encontrado"
                                description="Parece que não há tutores cadastrados com este nome."
                            />
                        )}

                        {!loading && !error && tutores.length > 0 && (
                            <div className="space-y-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {tutores.map((tutor) => (
                                    <div 
                                        key={tutor.id}
                                        onClick={() => navigate(`/tutores/${tutor.id}`)} // Assumindo rota de detalhe
                                        className="cursor-pointer transition-transform hover:scale-[1.02] active:scale-[0.98]"
                                    >
                                        <TutorCard tutor={tutor} />
                                    </div>
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

// --- Ícones Locais ---

function ErrorIcon({ className }: { className?: string }) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
            <circle cx="12" cy="12" r="10" />
            <line x1="12" x2="12" y1="8" y2="12" />
            <line x1="12" x2="12.01" y1="16" y2="16" />
        </svg>
    );
}

function SadUserIcon({ className }: { className?: string }) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
            <circle cx="12" cy="12" r="10" />
            <path d="M16 16s-1.5-2-4-2-4 2-4 2" />
            <line x1="9" x2="9.01" y1="9" y2="9" />
            <line x1="15" x2="15.01" y1="9" y2="9" />
        </svg>
    );
}