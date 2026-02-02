import { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { TutorFacade } from '@/facades/TutorFacade';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Search, UserPlus, Mail, Phone, MapPin, Users, ArrowRight, Plus } from 'lucide-react';
import { CustomPagination } from '@/components/ui/custom-pagination';
import type { Tutor } from '@/interfaces/tutor.interface';

export function TutorList() {
    const navigate = useNavigate();

    const [tutores, setTutores] = useState<Tutor[]>([]);
    const [loading, setLoading] = useState(true);
    const [nome, setNome] = useState('');
    const [pageCount, setPageCount] = useState(0);
    const [page, setPage] = useState(0);
    const ITENS_POR_PAGINA = 10;

    useEffect(() => {
        carregarDados();
    }, [nome, page]);

    async function carregarDados() {
        setLoading(true);
        try {
            const {data, total} = await TutorFacade.getAll(nome, page, ITENS_POR_PAGINA);
            const lista = data.content ? data.content : data;
            setTutores(lista as Tutor[]);
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

    return (
        <div className="min-h-screen min-w-screen from-amber-100 via-orange-50 to-amber-100 dark:from-stone-950 dark:via-neutral-900 dark:to-stone-950 p-4 font-sans">
            <main className="max-w-7xl mx-auto py-8 px-4 sm:px-6 relative z-10">
                
                <div className="flex flex-col md:flex-row items-end justify-between gap-6 mb-10 pb-6 border-b border-amber-200 dark:border-stone-800">
                    <div>
                        <div className="flex items-center gap-3 mb-2">
                            <div className="p-3 bg-amber-500 rounded-xl shadow-lg shadow-amber-500/30 rotate-3">
                                <Users className="w-8 h-8 text-white" />
                            </div>
                            <h1 className="text-4xl font-extrabold text-stone-800 dark:text-stone-100">
                                Rede de Tutores
                            </h1>
                        </div>
                        <p className="text-stone-500 dark:text-stone-400 max-w-md">
                            Listagem de Tutores.
                        </p>
                    </div>

                    <div className="flex gap-3 w-full md:w-auto">
                        <div className="flex-1 md:w-64">
                             <Input 
                                type="text" 
                                placeholder="Buscar por nome..." 
                                value={nome}
                                onChange={(val) => setNome(val)}
                                icon={Search}
                            />
                        </div>
                        <Button 
                            onClick={() => navigate('/tutores/novo')}
                            className="mt-2 bg-stone-800 text-stone-400 hover:bg-stone-700 text-ambar shadow-lg dark:bg-white dark:text-white-900"
                        >
                            <UserPlus className="w-4 h-4 mr-2" />
                            Novo
                        </Button>
                    </div>
                </div>

                {loading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {Array.from({ length: 6 }).map((_, i) => (
                            <Skeleton key={i} className="h-48 w-full rounded-2xl" />
                        ))}
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {tutores.map((tutor) => (
                            <div 
                                key={tutor.id}
                                onClick={() => navigate(`/tutores/${tutor.id}`)} // Ou rota de detalhe se tiver
                                className="group relative bg-white dark:bg-stone-900 rounded-2xl p-6 shadow-sm hover:shadow-xl transition-all duration-300 border border-stone-100 dark:border-stone-800 hover:border-amber-200 dark:hover:border-amber-900 cursor-pointer overflow-hidden"
                            >
                                <div className="absolute left-0 top-0 h-full w-1 bg-gradient-to-b from-amber-400 to-orange-500 transform -translate-x-full group-hover:translate-x-0 transition-transform duration-300" />
                                
                                <div className="flex items-start gap-4">
                                    <Avatar className="h-16 w-16 border-4 border-amber-50 dark:border-stone-800 shadow-sm group-hover:scale-105 transition-transform">
                                        {tutor.foto?.url ? (
                                            <AvatarImage src={tutor.foto.url} className="object-cover" />
                                        ) : (
                                            <AvatarFallback className="bg-gradient-to-br from-stone-100 to-stone-300 text-stone-600 text-xl font-bold">
                                                {tutor.nome.substring(0,2).toUpperCase()}
                                            </AvatarFallback>
                                        )}
                                    </Avatar>
                                    
                                    <div className="flex-1 min-w-0">
                                        <div className="flex justify-between items-start">
                                            <h3 className="text-lg font-bold text-stone-800 dark:text-stone-100 truncate group-hover:text-amber-600 transition-colors">
                                                {tutor.nome}
                                            </h3>
                                            <ArrowRight className="w-4 h-4 text-stone-300 group-hover:text-amber-500 -translate-x-2 group-hover:translate-x-0 opacity-0 group-hover:opacity-100 transition-all" />
                                        </div>
                                        <p className="text-xs font-mono text-stone-400 mb-3">ID: #{tutor.id}</p>
                                        
                                        <div className="space-y-1">
                                            <div className="flex items-center gap-2 text-sm text-stone-500 dark:text-stone-400">
                                                <Mail className="w-3.5 h-3.5 text-amber-500/70" />
                                                <span className="truncate">{tutor.email}</span>
                                            </div>
                                            <div className="flex items-center gap-2 text-sm text-stone-500 dark:text-stone-400">
                                                <Phone className="w-3.5 h-3.5 text-amber-500/70" />
                                                <span className="truncate">{tutor.telefone}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {tutor.endereco && (
                                    <div className="mt-4 pt-4 border-t border-stone-100 dark:border-stone-800 flex items-start gap-2">
                                        <MapPin className="w-3.5 h-3.5 text-stone-400 mt-0.5 shrink-0" />
                                        <p className="text-xs text-stone-400 line-clamp-1">{tutor.endereco}</p>
                                    </div>
                                )}
                            </div>
                        ))}

                        {tutores.length < ITENS_POR_PAGINA && (
                             <div 
                                onClick={() => navigate('/tutores/novo')}
                                className="h-50 w-full rounded-[2rem] border-4 border-dashed border-amber-300 dark:border-stone-700 flex flex-col items-center justify-center cursor-pointer hover:bg-amber-50 dark:hover:bg-stone-900 transition-colors group"
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