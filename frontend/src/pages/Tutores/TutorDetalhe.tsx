import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { TutorFacade } from '@/facades/TutorFacade'; // Ajuste o import
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    ArrowLeft,
    User,
    Dog,
    Edit3,
    Trash2,
    Plus,
} from 'lucide-react';
import { Loading } from '@/components/ui/loading';
import { TutorPetFacade } from '@/facades/TutorPetFacade';
import { toast } from 'react-toastify';
import { useConfirm } from '@/context/ModalContext';
import type { Tutor } from '@/interfaces/tutor.interface';
import { TutorDetail } from '@/components/Tutor/TutorDetail';
import { ListaPets } from '@/components/Tutor/ListaPets';

export function TutorDetalhe() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [tutor, setTutor] = useState<Tutor | null>(null);
    const [loading, setLoading] = useState(true);
    const [deleting, setDeleting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const { confirm } = useConfirm();

    useEffect(() => {
        if (id) {
            carregarDetalhes(id);
        }
    }, [id]);

    async function carregarDetalhes(tutorId: string) {
        setLoading(true);
        try {
            const data = await TutorFacade.getById(Number(tutorId));
            setTutor(data);
        } catch (err) {
            console.error('ERRO');
            console.error(err);
            setError("Não foi possível carregar os detalhes do tutor.");
        } finally {
            setLoading(false);
        }
    }

    const handleVoltar = () => navigate(-1);

    const handleEditar = () => {
        navigate(`/tutores/editar/${id}`);
    };

    const handleExcluir = async () => {
        confirm({
            title: "Remover Tutor?",
            description: `Tem certeza que deseja remover o tutor ${tutor?.nome}?`,
            variant: "destructive",
            confirmText: "Sim, remover",

            onConfirm: async () => {
                if (id) {
                    setDeleting(true);
                    try {
                        await TutorFacade.delete(Number(id));
                        toast.success('Tutor removido com sucesso.');
                    } catch (error) {
                        console.error(error);
                        toast.error('Erro ao excluir o tutor.');
                    } finally {
                        setDeleting(false);
                    }
                }
            }
        })
    };

    async function desvincular(petId: number) {
        confirm({
            title: "Desvincular Pet?",
            description: "Tem certeza? O pet não será excluído, apenas o vínculo será removido.",
            variant: "destructive",
            confirmText: "Sim, remover",

            onConfirm: async () => {
                if (id && petId) {
                    setDeleting(true);
                    try {
                        await TutorPetFacade.unlink(Number(id), Number(petId));
                        toast.success('Pet desvinculado.');
                        await carregarDetalhes(id);
                    } catch (error) {
                        console.error(error);
                        toast.error('Erro ao desvincular o pet.');
                    } finally {
                        setDeleting(false);
                    }
                }
            }
        })
    };

    const handleAdicionarPet = () => {
        navigate(`/tutores/${id}/pet/novo`);
    };

    if (loading) {
        return (<Loading />);
    }

    if (error || !tutor) {
        return (
            <div className="min-h-screen min-w-screen from-amber-100 to-orange-200 p-4 flex flex-col items-center justify-center text-center">
                <User className="w-16 h-16 text-stone-400 mb-4 opacity-50" />
                <h2 className="text-2xl font-bold text-stone-800 mb-4">{error || "Tutor não encontrado"}</h2>
                <Button onClick={() => navigate('/tutores')}>Voltar para Lista</Button>
            </div>
        );
    }

    return (
        <div className="min-h-screen min-w-screen text-stone-900 dark:text-stone-100">

            <div className="sticky top-0 z-10 border-b border-stone-200 dark:border-stone-800 xs:d-flex">
                <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
                    <Button variant="ghost" onClick={handleVoltar} className="group gap-2">
                        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                        Painel de Tutores
                    </Button>
                    <div className="lg:flex lg:gap-2 sm:ml-10">
                        <Button variant="outline" size="sm" onClick={handleEditar} className='sm:mb-2'>
                            <Edit3 className="w-4 h-4 mr-2" /> Editar
                        </Button>
                        <Button variant="destructive" size="sm" onClick={handleExcluir} disabled={deleting}>
                            <Trash2 className="w-4 h-4 mr-2" /> Excluir
                        </Button>
                    </div>
                </div>
            </div>

            <main className="max-w-7xl mx-auto p-4 md:p-8">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

                    <TutorDetail tutor={tutor}/>

                    <div className="lg:col-span-8 space-y-8">

                        <div className="bg-stone-100/50 dark:bg-stone-900/50 rounded-[32px] p-6 md:p-8 border border-stone-200 dark:border-stone-800 relative overflow-hidden">
                            <Dog className="absolute -top-6 -right-6 w-32 h-32 text-stone-200 dark:text-stone-800 opacity-50 rotate-12 pointer-events-none" />

                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 relative z-10">
                                <div>
                                    <h2 className="text-2xl font-bold flex items-center gap-3 text-stone-900 dark:text-white">
                                        Pets da Família
                                        <Badge variant="secondary" className="rounded-full bg-stone-200 dark:bg-stone-800 text-stone-700 dark:text-stone-300">
                                            {tutor.pets?.length || 0}
                                        </Badge>
                                    </h2>
                                    <p className="text-sm text-stone-500">Animais sob responsabilidade deste tutor.</p>
                                </div>
                                <Button
                                    onClick={handleAdicionarPet}
                                    className="rounded-full bg-amber-500 hover:bg-amber-600 text-white shadow-lg shadow-amber-500/20"
                                >
                                    <Plus className="w-4 h-4 mr-2" /> Vincular Novo Pet
                                </Button>
                            </div>

                            <div className="grid gap-4 relative z-10">
                                {tutor.pets && tutor.pets.length > 0 ? (
                                    tutor.pets.map((pet) => (
                                        <ListaPets pet={pet} Unlink={desvincular} key={pet.id}/>
                                    ))
                                ) : (
                                    <div className="py-16 flex flex-col items-center text-center bg-white dark:bg-stone-900/50 rounded-3xl border-2 border-dashed border-stone-200 dark:border-stone-800">
                                        <div className="w-16 h-16 bg-amber-50 dark:bg-stone-800 rounded-full flex items-center justify-center mb-4">
                                            <Dog className="text-amber-400 w-8 h-8" />
                                        </div>
                                        <h3 className="font-semibold text-lg">Nenhum pet vinculado</h3>
                                        <p className="text-sm text-stone-500 max-w-[260px] mb-6">
                                            Este tutor ainda não possui animais cadastrados no sistema.
                                        </p>
                                        <Button variant="outline" onClick={handleAdicionarPet} className="border-amber-200 text-amber-700 hover:bg-amber-50">
                                            Adicionar o primeiro pet
                                        </Button>
                                    </div>
                                )}
                            </div>
                        </div>

                    </div>
                </div>
            </main>
        </div>
    );
}