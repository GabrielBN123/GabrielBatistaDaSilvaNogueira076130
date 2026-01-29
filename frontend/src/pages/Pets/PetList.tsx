import { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { PetFacade } from '@/facades/PetFacade';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { CustomPagination } from '@/components/ui/custom-pagination';
import { Search, Plus, PawPrint, Dog, Sparkles } from 'lucide-react';
import type { Pet } from '@/interfaces/pet.interface';

export function PetList() {
    const navigate = useNavigate();
    
    const [pets, setPets] = useState<Pet[]>([]);
    const [loading, setLoading] = useState(true);
    const [nome, setNome] = useState('');
    
    const [page, setPage] = useState(0);
    const [pageCount, setPageCount] = useState(0);
    const ITENS_POR_PAGINA = 10;

    useEffect(() => {
        carregarDados();
    }, [nome, page]);

    async function carregarDados() {
        setLoading(true);
        try {
            const { data, total } = await PetFacade.getAll(nome, page, '', ITENS_POR_PAGINA);
            const lista = data.content ? data.content : data;
            
            setPets(lista);
            setPageCount(Math.ceil(total / ITENS_POR_PAGINA));
        } catch (error) {
            console.error(error);
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

    return (
        <div className="min-h-screen min-w-screen from-amber-100 via-orange-50 to-amber-100 dark:from-stone-950 dark:via-neutral-900 dark:to-stone-950 p-4 font-sans">
            <main className="max-w-7xl mx-auto py-8 px-4 sm:px-6">
                
                <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-12">
                    <div className="text-center md:text-left">
                        <h1 className="text-4xl md:text-5xl font-black text-amber-600 dark:text-amber-500 tracking-tighter drop-shadow-sm flex items-center gap-3 justify-center md:justify-start">
                            <PawPrint className="w-10 h-10 -rotate-12" />
                            Meus Pets
                        </h1>
                        <p className="text-stone-600 dark:text-stone-400 mt-2 text-lg">
                            Listagem de Pets.
                        </p>
                    </div>

                    <div className="flex items-center gap-3 bg-white/60 dark:bg-stone-900/60 p-2 rounded-full shadow-xl backdrop-blur-md border border-white/20">
                        <div className="relative group">
                            <Input 
                                type="text" 
                                placeholder="Procurar amigo..." 
                                value={nome}
                                onChange={handleSearch}
                                icon={Search}
                                className="rounded-full border-none bg-transparent w-48 md:w-64 focus:ring-0 focus:w-72 transition-all duration-300"
                            />
                        </div>
                        <Button 
                            onClick={() => navigate('/pets/novo')}
                            size="icon" 
                            className="rounded-full h-12 w-12 bg-gradient-to-r from-amber-500 to-orange-600 hover:scale-110 transition-transform shadow-lg shadow-orange-500/30"
                        >
                            <Plus className="w-6 h-6 text-gray dark:text-white" />
                        </Button>
                    </div>
                </div>

                {loading ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                        {Array.from({ length: 8 }).map((_, i) => (
                            <Skeleton key={i} className="h-80 w-full rounded-3xl" />
                        ))}
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                        {pets.map((pet, index) => (
                            <div 
                                key={pet.id}
                                onClick={() => navigate(`/pets/${pet.id}`)}
                                className="group relative h-96 w-full cursor-pointer perspective-1000"
                                style={{ animationDelay: `${index * 50}ms` }}
                            >
                                <div className="relative h-full w-full rounded-[2rem] overflow-hidden bg-white dark:bg-stone-800 shadow-xl transition-all duration-500 ease-out transform group-hover:-translate-y-3 group-hover:rotate-1 group-hover:shadow-2xl border-4 border-white dark:border-stone-700">
                                    <div className="absolute inset-0 bg-stone-200">
                                        {pet.foto?.url ? (
                                            <img 
                                                src={pet.foto.url} 
                                                alt={pet.nome} 
                                                className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                                            />
                                        ) : (
                                            <div className="h-full w-full flex items-center justify-center bg-amber-100 dark:bg-stone-800">
                                                <Dog className="w-24 h-24 text-amber-300/50" />
                                            </div>
                                        )}
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-80" />
                                    </div>

                                    <div className="absolute bottom-0 left-0 w-full p-6 text-white translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                                        <div className="flex justify-between items-end mb-1">
                                            <h2 className="text-3xl font-black tracking-wide drop-shadow-md">{pet.nome}</h2>
                                            <Badge className="bg-amber-500 text-white border-none text-xs font-bold px-2 py-1 mb-1">
                                                {pet.idade} - {parseInt(pet.idade) > 1 ? 'Ano' : 'Anos'}
                                            </Badge>
                                        </div>
                                        
                                        <div className="h-0 group-hover:h-auto overflow-hidden transition-all duration-300 opacity-0 group-hover:opacity-100">
                                            <p className="text-amber-200 font-medium flex items-center gap-2 text-sm mb-2">
                                                <Sparkles className="w-3 h-3" /> {pet.raca}
                                            </p>
                                            <Button size="sm" className="w-full rounded-full bg-white/20 hover:bg-white/40 backdrop-blur-sm border border-white/30 text-amber-900 dark:text-stone-200">
                                                Ver Detalhes
                                            </Button>
                                        </div>
                                        
                                        <div className="group-hover:hidden flex items-center gap-2 text-sm text-stone-300">
                                            <span className="truncate">{pet.raca}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}

                        {pets.length < ITENS_POR_PAGINA && (
                             <div 
                                onClick={() => navigate('/pets/novo')}
                                className="h-96 w-full rounded-[2rem] border-4 border-dashed border-amber-300 dark:border-stone-700 flex flex-col items-center justify-center cursor-pointer hover:bg-amber-50 dark:hover:bg-stone-900 transition-colors group"
                            >
                                <div className="bg-amber-100 dark:bg-stone-800 p-6 rounded-full group-hover:scale-110 transition-transform duration-300 mb-4">
                                    <Plus className="w-10 h-10 text-amber-600 dark:text-amber-400" />
                                </div>
                                <span className="font-bold text-amber-700 dark:text-amber-500 text-lg">Adicionar Novo</span>
                            </div>
                        )}
                    </div>
                )}

                {!loading && pageCount > 1 && (
                    <div className="flex justify-center mt-12 pb-8">
                        <div className="bg-white/40 dark:bg-stone-900/40 backdrop-blur-md rounded-2xl p-4 shadow-lg border border-white/20">
                            <CustomPagination
                                currentPage={page}
                                totalPages={pageCount}
                                onPageChange={handlePageChange}
                            />
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
}