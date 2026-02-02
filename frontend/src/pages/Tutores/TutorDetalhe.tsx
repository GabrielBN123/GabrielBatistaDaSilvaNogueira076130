import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { TutorFacade } from '@/facades/TutorFacade'; // Ajuste o import
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
    ArrowLeft,
    Mail,
    Phone,
    MapPin,
    User,
    Dog,
    CreditCard,
    Edit3,
    Trash2,
    Plus,
    PawPrint,
    Loader2
} from 'lucide-react';
import { Loading } from '@/components/ui/loading';
import { TutorPetFacade } from '@/facades/TutorPetFacade';
import { toast } from 'react-toastify';
import { useConfirm } from '@/context/ModalContext';
import type { Tutor } from '@/interfaces/tutor.interface';

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
        <div className="min-h-screen min-w-screen from-amber-100 to-orange-200 dark:from-stone-950 dark:to-neutral-900 p-4 relative overflow-hidden">
            <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">

                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <Button
                        variant="ghost"
                        onClick={handleVoltar}
                        className="gap-2 hover:bg-white/20 text-stone-700 dark:text-stone-200 pl-0 sm:pl-4"
                    >
                        <ArrowLeft className="w-5 h-5" />
                        Voltar
                    </Button>

                    <div className="flex items-center gap-2 w-full sm:w-auto">
                        <Button
                            variant="outline"
                            onClick={handleEditar}
                            className="flex-1 sm:flex-none border-amber-300 hover:bg-amber-100 text-amber-900 dark:border-stone-600 dark:text-stone-200 dark:hover:bg-stone-800"
                        >
                            <Edit3 className="w-4 h-4 mr-2" />
                            Editar
                        </Button>

                        <Button
                            variant="destructive"
                            onClick={handleExcluir}
                            disabled={deleting}
                            className="flex-1 text-stone-700 dark:text-stone-200 sm:flex-none bg-red-500 hover:bg-red-600"
                        >
                            {deleting ? (
                                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            ) : (
                                <Trash2 className="w-4 h-4 mr-2" />
                            )}
                            Remover
                        </Button>
                    </div>
                </div>

                <div className="relative">
                    <Card className="border-none shadow-2xl bg-white/80 dark:bg-stone-900/80 backdrop-blur-md overflow-visible mt-12 md:mt-0">
                        <div className="flex flex-col md:flex-row">

                            <div className="relative w-full md:w-auto flex justify-center md:block p-6 md:p-0 md:-mt-8 md:-ml-8 mb-4 md:mb-0">
                                <div className="w-64 h-64 md:w-72 md:h-72 rounded-2xl shadow-2xl overflow-hidden border-4 border-white dark:border-stone-700 bg-stone-200">
                                    {tutor.foto?.url ? (
                                        <img
                                            src={tutor.foto.url}
                                            alt={tutor.nome}
                                            className="w-full h-full object-cover transition-transform hover:scale-110 duration-500"
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-stone-400 bg-stone-100 dark:bg-stone-800">
                                            <User className="w-24 h-24 opacity-20" />
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="flex-1 p-6 md:py-8 md:pr-8 flex flex-col gap-6">
                                <div className="flex flex-wrap items-start justify-between gap-4">
                                    <div>
                                        <div className="flex items-center gap-3 mb-1">
                                            <h1 className="text-4xl md:text-5xl font-extrabold text-stone-800 dark:text-stone-100 tracking-tight">
                                                {tutor.nome}
                                            </h1>
                                        </div>
                                        <Badge variant="outline" className="text-sm border-amber-500 text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-transparent">
                                            Tutor #{tutor.id}
                                        </Badge>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-2">
                                    <div className="flex items-center gap-4 p-4 rounded-xl bg-amber-50 dark:bg-stone-800/50 border border-amber-100 dark:border-stone-700">
                                        <div className="p-3 bg-white dark:bg-stone-700 rounded-full shadow-sm">
                                            <Mail className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                                        </div>
                                        <div className="overflow-hidden">
                                            <p className="text-sm text-muted-foreground">Email</p>
                                            <p className="text-base font-semibold text-stone-800 dark:text-stone-200 truncate" title={tutor.email}>
                                                {tutor.email}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-4 p-4 rounded-xl bg-amber-50 dark:bg-stone-800/50 border border-amber-100 dark:border-stone-700">
                                        <div className="p-3 bg-white dark:bg-stone-700 rounded-full shadow-sm">
                                            <Phone className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                                        </div>
                                        <div>
                                            <p className="text-sm text-muted-foreground">Telefone</p>
                                            <p className="text-base font-semibold text-stone-800 dark:text-stone-200">
                                                {tutor.telefone}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-4 p-4 rounded-xl bg-amber-50 dark:bg-stone-800/50 border border-amber-100 dark:border-stone-700">
                                        <div className="p-3 bg-white dark:bg-stone-700 rounded-full shadow-sm">
                                            <CreditCard className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                                        </div>
                                        <div>
                                            <p className="text-sm text-muted-foreground">CPF</p>
                                            <p className="text-base font-semibold text-stone-800 dark:text-stone-200">
                                                {tutor.cpf || "Não informado"}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-4 p-4 rounded-xl bg-amber-50 dark:bg-stone-800/50 border border-amber-100 dark:border-stone-700">
                                        <div className="p-3 bg-white dark:bg-stone-700 rounded-full shadow-sm">
                                            <MapPin className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                                        </div>
                                        <div>
                                            <p className="text-sm text-muted-foreground">Endereço</p>
                                            <p className="text-base font-semibold text-stone-800 dark:text-stone-200 line-clamp-1" title={tutor.endereco}>
                                                {tutor.endereco}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Card>
                </div>

                <div className="space-y-4 pt-4">
                    <div className="flex items-center justify-between flex-wrap gap-4">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-primary/10 rounded-lg">
                                <Dog className="w-6 h-6 text-primary" />
                            </div>
                            <h2 className="text-2xl font-bold text-stone-800 dark:text-stone-100">
                                Pets do Tutor
                            </h2>
                        </div>

                        <Button onClick={handleAdicionarPet} className="gap-2 bg-primary text-stone-800 dark:text-stone-100 hover:bg-primary/90 shadow-md shadow-amber-900/20">
                            <Plus className="w-4 h-4" />
                            Adicionar Pet
                        </Button>
                    </div>

                    {tutor.pets && tutor.pets.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {tutor.pets.map((pet) => (
                                <Card
                                    key={pet.id}
                                    className="group hover:border-primary/50 transition-all duration-300 hover:shadow-lg hover:-translate-y-1 cursor-pointer dark:bg-stone-900/75"
                                    
                                >
                                    <CardHeader className="flex flex-row items-center gap-4 pb-3">
                                        <Avatar className="h-14 w-14 border-2 border-white shadow-md">
                                            {pet.foto?.url ? (
                                                <AvatarImage src={pet.foto.url} alt={pet.nome} className="object-cover" />
                                            ) : (
                                                <AvatarFallback className="bg-gradient-to-br from-amber-200 to-orange-300 text-amber-900 font-bold">
                                                    <PawPrint className="w-6 h-6 opacity-50" />
                                                </AvatarFallback>
                                            )}
                                        </Avatar>
                                        <div className="overflow-hidden">
                                            <CardTitle className="text-lg font-bold truncate text-stone-800 dark:text-stone-100">
                                                {pet.nome}
                                            </CardTitle>
                                            <p className="text-sm text-muted-foreground">
                                                {pet.raca}
                                            </p>
                                        </div>
                                    </CardHeader>
                                    <CardContent className="pt-0 pb-4">
                                        <div className="flex items-center gap-2 text-sm text-stone-600 dark:text-stone-400 bg-stone-50 dark:bg-stone-900/50 p-2 rounded-lg">
                                            <Badge variant="outline" className="border-amber-200 text-amber-800 text-[10px] px-1 h-5">
                                                ID: {pet.id}
                                            </Badge>
                                            <span>
                                                {pet.idade} {pet.idade === 1 ? 'ano' : 'anos'}
                                            </span>
                                        </div>
                                        <div className="mt-1 h-0 group-hover:h-auto overflow-hidden transition-all duration-300 opacity-0 group-hover:opacity-100">
                                            <Button size="sm" className="mb-2 w-full rounded-full bg-white/20 hover:bg-white/40 backdrop-blur-sm border border-white/30 text-amber-900 dark:text-stone-200" onClick={() => navigate(`/pets/${pet.id}`)}>
                                                <PawPrint className="w-4 h-4 mr-2" />
                                                Ver Detalhes
                                            </Button>
                                            <Button
                                                onClick={() => desvincular(pet.id)}
                                                className="w-full flex-1 text-stone-700 dark:text-stone-200 sm:flex-none bg-red-500 hover:bg-red-600"
                                            >
                                                {deleting ? (
                                                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                                ) : (
                                                    <Trash2 className="w-4 h-4 mr-2" />
                                                )}
                                                Desvincular
                                            </Button>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center p-12 border-2 border-dashed border-amber-200 dark:border-stone-700 rounded-xl bg-white/30 dark:bg-stone-900/30">
                            <div className="p-4 bg-amber-100 dark:bg-stone-800 rounded-full mb-4">
                                <PawPrint className="w-8 h-8 text-amber-600 dark:text-amber-400" />
                            </div>
                            <h3 className="text-lg font-semibold text-stone-800 dark:text-stone-200">Nenhum pet vinculado</h3>
                            <p className="text-muted-foreground mb-6 text-center max-w-xs">
                                Este tutor ainda não possui pets cadastrados.
                            </p>
                            <Button variant="outline" onClick={handleAdicionarPet} className="border-amber-300 text-amber-800 hover:bg-amber-50">
                                Vincular Pet
                            </Button>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}