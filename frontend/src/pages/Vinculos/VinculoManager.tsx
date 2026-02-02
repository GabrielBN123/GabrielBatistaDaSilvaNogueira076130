import { useEffect, useState, useCallback } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { TutorFacade } from '@/facades/TutorFacade';
import { PetFacade } from '@/facades/PetFacade';
import { TutorPetFacade } from '@/facades/TutorPetFacade';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'react-toastify';
import {
    Link2,
    ArrowLeft,
    Search,
    User,
    Dog,
    CheckCircle2,
    Plus,
    Loader2
} from 'lucide-react';
import { CustomPagination } from '@/components/ui/custom-pagination';

type EntityType = 'tutor' | 'pet';

interface GenericEntity {
    id: number;
    nome: string;
    subtitulo: string;
    detalhe: string;  
    fotoUrl?: string;
    tipo: EntityType;
}

export function VinculoManager() {
    const { id } = useParams();
    const navigate = useNavigate();
    const location = useLocation();

    const isTutorSource = location.pathname.includes('/tutores/');
    const sourceLabel = isTutorSource ? 'Tutor' : 'Pet';
    const targetLabel = isTutorSource ? 'Pet' : 'Tutor';
    const [sourceEntity, setSourceEntity] = useState<GenericEntity | null>(null);
    const [targetList, setTargetList] = useState<GenericEntity[]>([]);
    const [nome, setNome] = useState('');
    const [loadingSource, setLoadingSource] = useState(true);
    const [loadingSearch, setLoadingSearch] = useState(false);
    const [linkingId, setLinkingId] = useState<number | null>(null);
    const [pageCount, setPageCount] = useState(0);
    const [page, setPage] = useState(0);
    const ITENS_POR_PAGINA = 10;

    useEffect(() => {
        if (id) {
            carregarOrigem(Number(id));
        }
    }, [id, isTutorSource]);

    useEffect(() => {
        buscarAlvos();
    }, [nome, page]);

    async function carregarOrigem(entityId: number) {
        setLoadingSource(true);
        try {
            if (isTutorSource) {
                const data = await TutorFacade.getById(entityId);
                setSourceEntity({
                    id: data.id,
                    nome: data.nome,
                    subtitulo: data.email,
                    detalhe: data.telefone,
                    fotoUrl: data.foto?.url,
                    tipo: 'tutor'
                });
            } else {
                const data = await PetFacade.getById(entityId);
                setSourceEntity({
                    id: data.id,
                    nome: data.nome,
                    subtitulo: data.raca,
                    detalhe: `${data.idade} anos`,
                    fotoUrl: data.foto?.url,
                    tipo: 'pet'
                });
            }
        } catch (error) {
            toast.error(`Erro ao carregar ${sourceLabel}.`);
            navigate(-1);
        } finally {
            setLoadingSource(false);
        }
    }

    const handlePageChange = useCallback((newPage: number) => {
        if (newPage >= 0 && newPage < pageCount) {
            setPage(newPage);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    }, [pageCount]);

    async function buscarAlvos() {
        setLoadingSearch(true);
        try {
            let results: GenericEntity[] = [];

            if (isTutorSource) {
                const { data, total } = await PetFacade.getAll(nome, page, '', ITENS_POR_PAGINA);
                const lista = data.content || data;
                setPageCount(Math.ceil(total / ITENS_POR_PAGINA));
                results = lista.map((p: any) => ({
                    id: p.id,
                    nome: p.nome,
                    subtitulo: p.raca,
                    detalhe: `${p.idade} anos`,
                    fotoUrl: p.foto?.url,
                    tipo: 'pet'
                }));
            } else {
                const { data, total } = await TutorFacade.getAll(nome, page, ITENS_POR_PAGINA);
                const lista = data.content || data;
                setPageCount(Math.ceil(total / ITENS_POR_PAGINA));

                results = lista.map((t: any) => ({
                    id: t.id,
                    nome: t.nome,
                    subtitulo: t.email,
                    detalhe: t.telefone,
                    fotoUrl: t.foto?.url,
                    tipo: 'tutor'
                }));
            }
            setTargetList(results);
        } catch (error) {
            console.error(error);
        } finally {
            setLoadingSearch(false);
        }
    }

    async function handleVincular(targetId: number) {
        if (!sourceEntity) return;
        setLinkingId(targetId);

        try {
            const tutorId = isTutorSource ? sourceEntity.id : targetId;
            const petId = isTutorSource ? targetId : sourceEntity.id;
            await TutorPetFacade.link(tutorId, petId);
            toast.success('Vínculo realizado com sucesso!');
            navigate(isTutorSource ? `/tutores/${tutorId}` : `/pets/${petId}`);
        } catch (error) {
            toast.error('Erro ao criar o vínculo. Verifique se já não estão vinculados!');
        } finally {
            setLinkingId(null);
        }
    }

    const handleCriarNovo = () => {
        if (isTutorSource) {
            navigate('/pets/novo');
        } else {
            navigate('/tutores/novo');
        }
    };

    return (
        <div className="min-h-screen min-w-screen p-4 font-sans relative overflow-hidden">

            <main className="max-w-4xl mx-auto py-8 px-4">

                <div className="flex items-center gap-4 mb-8">
                    <Button variant="ghost" onClick={() => navigate(-1)} className="rounded-full h-10 w-10 p-0">
                        <ArrowLeft className="w-5 h-5" />
                    </Button>
                    <div>
                        <h1 className="text-2xl font-bold text-stone-800 dark:text-stone-100 flex items-center gap-2">
                            <Link2 className="w-6 h-6 text-primary" />
                            Gerenciar Vínculos
                        </h1>
                        <p className="text-stone-500">Adicione um novo {targetLabel} para o {sourceLabel} selecionado.</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">

                    <div className="space-y-4">
                        <h2 className="text-sm font-bold uppercase tracking-wider text-stone-400">
                            {sourceLabel} Selecionado
                        </h2>

                        {loadingSource ? (
                            <Skeleton className="h-64 w-full rounded-2xl" />
                        ) : sourceEntity ? (
                            <Card className="border-2 border-primary/20 shadow-lg bg-white/80 dark:bg-stone-900/80 backdrop-blur dark:bg-stone-900/75">
                                <CardContent className="flex flex-col items-center p-8 text-center space-y-4">
                                    <Avatar className="h-32 w-32 border-4 border-white shadow-xl">
                                        {sourceEntity.fotoUrl ? (
                                            <AvatarImage src={sourceEntity.fotoUrl} className="object-cover" />
                                        ) : (
                                            <AvatarFallback className="bg-stone-200 text-stone-500 text-4xl">
                                                {sourceEntity.nome.substring(0, 1)}
                                            </AvatarFallback>
                                        )}
                                    </Avatar>
                                    <div>
                                        <h3 className="text-2xl font-bold text-stone-800 dark:text-stone-100">
                                            {sourceEntity.nome}
                                        </h3>
                                        <Badge variant="secondary" className="mt-2">
                                            ID: {sourceEntity.id}
                                        </Badge>
                                    </div>
                                    <div className="text-stone-500 text-sm space-y-1">
                                        <p>{sourceEntity.subtitulo}</p>
                                        <p>{sourceEntity.detalhe}</p>
                                    </div>
                                </CardContent>
                            </Card>
                        ) : null}
                    </div>

                    <div className="space-y-4 relative">
                        <div className="flex items-center justify-between">
                            <h2 className="text-sm font-bold uppercase tracking-wider text-stone-400">
                                Buscar {targetLabel} para vincular
                            </h2>
                            <Button variant="link" size="sm" onClick={handleCriarNovo} className="text-primary h-auto p-0">
                                <Plus className="w-3 h-3 mr-1" />
                                Cadastrar Novo
                            </Button>
                        </div>

                        <div className="relative z-20">
                            <Input
                                type='text'
                                placeholder={`Digite o nome do ${targetLabel}...`}
                                value={nome}
                                onChange={(val) => setNome(val)}
                                className=""
                                icon={Search}
                            />
                        </div>

                        <div className="space-y-3 mt-4">
                            {loadingSearch && (
                                <div className="text-center py-4 text-stone-400 animate-pulse">
                                    Buscando...
                                </div>
                            )}

                            {!loadingSearch && nome.length > 2 && targetList.length === 0 && (
                                <div className="text-center py-8 border-2 border-dashed border-stone-200 rounded-xl">
                                    <p className="text-stone-500">Nenhum {targetLabel} encontrado.</p>
                                    <Button variant="outline" onClick={handleCriarNovo} className="mt-2">
                                        Cadastrar Novo {targetLabel}
                                    </Button>
                                </div>
                            )}
                            {!loadingSearch && pageCount > 1 && (
                                <div className="flex justify-center mt-5 pb-8">
                                    <div className="bg-white/40 dark:bg-stone-900/40 backdrop-blur-md rounded-2xl p-4 shadow-lg border border-white/20">
                                        <CustomPagination
                                            currentPage={page}
                                            totalPages={pageCount}
                                            onPageChange={handlePageChange}
                                        />
                                    </div>
                                </div>
                            )}

                            {targetList.map((target) => (
                                <Card
                                    key={target.id}
                                    className="group overflow-hidden hover:border-primary transition-colors cursor-pointer dark:bg-stone-900/75"
                                >
                                    <div className="flex items-center p-3 gap-3">
                                        <Avatar className="h-12 w-12 border border-stone-200">
                                            {target.fotoUrl ? (
                                                <AvatarImage src={target.fotoUrl} className="object-cover" />
                                            ) : (
                                                <AvatarFallback>
                                                    {isTutorSource ? <Dog className="w-5 h-5" /> : <User className="w-5 h-5" />}
                                                </AvatarFallback>
                                            )}
                                        </Avatar>

                                        <div className="flex-1 min-w-0">
                                            <h4 className="font-bold text-stone-800 dark:text-stone-200 truncate">
                                                {target.nome}
                                            </h4>
                                            <p className="text-xs text-stone-500 truncate">
                                                {target.subtitulo} • {target.detalhe}
                                            </p>
                                        </div>

                                        <Button
                                            size="sm"
                                            onClick={() => handleVincular(target.id)}
                                            disabled={linkingId === target.id}
                                            className="opacity-0 group-hover:opacity-100 transition-opacity bg-primary hover:bg-primary/90"
                                        >
                                            {linkingId === target.id ? (
                                                <Loader2 className="w-4 h-4 animate-spin" />
                                            ) : (
                                                <>
                                                    Vincular
                                                    <CheckCircle2 className="w-3 h-3 ml-1" />
                                                </>
                                            )}
                                        </Button>
                                    </div>
                                </Card>
                            ))}

                            {!loadingSearch && pageCount > 1 && (
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
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}