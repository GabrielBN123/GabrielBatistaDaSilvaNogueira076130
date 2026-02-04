import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { PetFacade } from '@/facades/PetFacade';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    ArrowLeft,
    Edit3,
    Trash2,
    UserPlus,
} from 'lucide-react';
import { Loading } from '@/components/ui/loading';
import { TutorPetFacade } from '@/facades/TutorPetFacade';
import { toast } from 'react-toastify';
import { useConfirm } from '@/context/ModalContext';
import type { Pet } from '@/interfaces/pet.interface';
import { ListaTutores } from '@/components/pets/ListaTutores';
import { PetDetail } from '@/components/pets/PetDetail';

export function PetDetalhe() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [pet, setPet] = useState<Pet | null>(null);
    const [loading, setLoading] = useState(true);
    const [deleting, setDeleting] = useState(false);
    const { confirm } = useConfirm();

    useEffect(() => {
        if (id) carregarDetalhes(id);
    }, [id]);

    async function carregarDetalhes(petId: string) {
        setLoading(true);
        try {
            const data = await PetFacade.getById(Number(petId));
            setPet(data);
        } catch (err) {
            toast.error("Não foi possível carregar os detalhes.");
        } finally {
            setLoading(false);
        }
    }

    const handleVoltar = () => navigate('/pets');

    const handleExcluir = async () => {

        confirm({
            title: "Remover Tutor?",
            description: `Tem certeza que deseja remover o pet ${pet?.nome}? Essa ação não pode ser desfeita.`,
            variant: "destructive",
            confirmText: "Sim, remover",

            onConfirm: async () => {
                if (id) {
                    setDeleting(true);
                    try {
                        await PetFacade.delete(Number(id));
                        toast.success('Pet Removido.');
                        navigate('/pets');
                    } catch (error) {
                        console.error(error);
                        toast.error('Erro ao excluir o pet.');
                    } finally {
                        setDeleting(false);
                    }
                }
            }
        })
    };

    async function handleUnlink(tutorId: number) {

        confirm({
            title: "Desvincular Tutor?",
            description: "Tem certeza? O tutor não será excluído, apenas o vínculo será removido.",
            variant: "destructive",
            confirmText: "Sim, remover",

            onConfirm: async () => {
                if (id && tutorId) {
                    setDeleting(true);
                    try {
                        await TutorPetFacade.unlink(Number(tutorId), Number(id));
                        toast.success('Pet desvinculado.');
                        await carregarDetalhes(id);
                    } catch (error) {
                        console.error(error);
                        toast.error('Erro ao desvincular o tutor.');
                    } finally {
                        setDeleting(false);
                    }
                }
            }
        })

    }

    const handleCadastrarTutor = () => {
        navigate(`/pets/${id}/tutor/novo`);
    };

    if (loading) return <Loading />;
    if (!pet) return <div className="p-20 min-w-screen text-center">
        <h2 className="text-2xl font-bold items-center gap-3 text-center mb-4">
            Pet não encontrado!
            <Badge variant="secondary" className="rounded-full"></Badge>
        </h2>
        <Button variant="ghost" onClick={handleVoltar} className="group gap-2">
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            Painel de Pets
        </Button>
    </div>;

    return (
        <div className="min-h-screen min-w-screen text-stone-900 dark:text-stone-100">
            <div className="sticky top-0 z-10 border-b border-stone-200 dark:border-stone-800">
                <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
                    <Button variant="destructive" onClick={handleVoltar} className="group gap-2">
                        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                        Painel de Pets
                    </Button>
                    <div className="flex gap-2">
                        <Button variant="destructive" size="sm" onClick={() => navigate(`/pets/editar/${id}`)}>
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

                    <PetDetail pet={pet} />

                    <div className="lg:col-span-8 space-y-8">

                        <div className="bg-stone-100/50 dark:bg-stone-900/50 rounded-[32px] p-6 md:p-8 border border-stone-200 dark:border-stone-800">
                            <div className="flex items-center justify-between mb-8">
                                <div>
                                    <h2 className="text-2xl font-bold flex items-center gap-3 dark:text-light">
                                        Tutores Responsáveis
                                        <Badge variant="secondary" className="rounded-full">{pet.tutores?.length || 0}</Badge>
                                    </h2>
                                    <p className="text-sm text-stone-500">Pessoas vinculadas ao cuidado de {pet.nome}</p>
                                </div>
                                <Button onClick={handleCadastrarTutor} className="rounded-full light:bg-stone-900 dark:bg-orange-500 hover:bg-stone-800 dark:hover:bg-orange-600 text-white">
                                    <UserPlus className="w-4 h-4 mr-2" /> Adicionar
                                </Button>
                            </div>

                            <div className="grid gap-4">
                                {pet.tutores && pet.tutores.length > 0 ? (
                                    pet.tutores.map((tutor) => (
                                        <ListaTutores tutor={tutor} Unlink={handleUnlink} key={tutor.id}/>
                                    ))
                                ) : (
                                    <div className="py-12 flex flex-col items-center text-center bg-white dark:bg-stone-900 rounded-3xl border-2 border-dashed border-stone-200 dark:border-stone-800">
                                        <div className="w-16 h-16 bg-orange-50 dark:bg-stone-800 rounded-full flex items-center justify-center mb-4">
                                            <UserPlus className="text-orange-500 w-8 h-8" />
                                        </div>
                                        <p className="font-medium">Nenhum tutor vinculado</p>
                                        <p className="text-sm text-stone-500 max-w-[240px]">Vincule um responsável para gerenciar as notificações de {pet.nome}.</p>
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