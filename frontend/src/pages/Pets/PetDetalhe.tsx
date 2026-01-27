import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { PetFacade } from '@/facades/PetFacade';
import { useAuth } from '@/context/AuthContext';
import { Header } from '@/components/ui/header';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  ArrowLeft, 
  Mail, 
  Phone, 
  MapPin, 
  User, 
  Dog, 
  Calendar,
  Edit3,      // Ícone Editar
  Trash2,     // Ícone Excluir
  UserPlus,   // Ícone Adicionar Tutor
  PawPrint,
  Loader2
} from 'lucide-react';

// Interfaces (Mantidas conforme seu padrão)
interface Foto {
    id: number;
    nome: string;
    contentType: string;
    url: string;
}
  
interface Tutor {
    id: number;
    nome: string;
    email: string;
    telefone: string;
    endereco: string;
    cpf: string | null;
    foto: Foto | null;
}
  
interface PetDetalheData {
    id: number;
    nome: string;
    raca: string;
    idade: number;
    foto: Foto | null;
    tutores: Tutor[];
}

export function PetDetalhe() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { signOut } = useAuth();

    const [pet, setPet] = useState<PetDetalheData | null>(null);
    const [loading, setLoading] = useState(true);
    const [deleting, setDeleting] = useState(false); // Estado para loading de exclusão
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (id) {
            carregarDetalhes(id);
        }
    }, [id]);

    async function carregarDetalhes(petId: string) {
        setLoading(true);
        try {
            const data = await PetFacade.getById(Number(petId));
            setPet(data);
        } catch (err) {
            console.error(err);
            setError("Não foi possível carregar os detalhes do pet.");
        } finally {
            setLoading(false);
        }
    }

    // --- Ações dos Botões ---

    const handleVoltar = () => navigate(-1);

    const handleEditar = () => {
        navigate(`/pets/editar/${id}`);
    };

    const handleExcluir = async () => {
        // Confirmação simples (pode ser trocado por um Modal/Dialog depois)
        const confirmou = window.confirm(`Tem certeza que deseja remover o pet ${pet?.nome}? Essa ação não pode ser desfeita.`);
        
        if (confirmou && id) {
            setDeleting(true);
            try {
                // Supondo método delete no Facade
                // await PetFacade.delete(Number(id)); 
                
                // Simulação de delay para ver o loading
                await new Promise(resolve => setTimeout(resolve, 1000));
                
                alert('Pet removido com sucesso.');
                navigate('/'); // Volta para Dashboard
            } catch (error) {
                console.error(error);
                alert('Erro ao excluir o pet.');
            } finally {
                setDeleting(false);
            }
        }
    };

    const handleCadastrarTutor = () => {
        // Navega para a tela de vínculo ou cadastro de tutor
        navigate(`/pets/${id}/tutores/novo`); 
    };

    // --- Renderização de Loading ---
    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-b from-amber-100 to-orange-200 dark:from-stone-950 dark:to-neutral-900 p-4">
                 <Header userName="Tutor" onSignOut={signOut} />
                 <main className="max-w-5xl mx-auto px-4 py-8 space-y-6">
                    <div className="flex justify-between">
                        <Skeleton className="h-10 w-24" />
                        <div className="flex gap-2"><Skeleton className="h-10 w-24" /><Skeleton className="h-10 w-24" /></div>
                    </div>
                    <div className="flex flex-col md:flex-row gap-6">
                        <Skeleton className="h-72 w-full md:w-72 rounded-xl" />
                        <Skeleton className="h-72 flex-1 rounded-xl" />
                    </div>
                 </main>
            </div>
        );
    }

    if (error || !pet) {
        return (
            <div className="min-h-screen bg-gradient-to-b from-amber-100 to-orange-200 p-4 flex flex-col items-center justify-center text-center">
                 <Dog className="w-16 h-16 text-stone-400 mb-4 opacity-50" />
                 <h2 className="text-2xl font-bold text-stone-800 mb-4">{error || "Pet não encontrado"}</h2>
                 <Button onClick={() => navigate('/')}>Voltar para o Início</Button>
            </div>
        );
    }

    return (
        <div className="min-h-screen min-w-screen bg-gradient-to-b from-amber-100 to-orange-200 dark:from-stone-950 dark:to-neutral-900 p-4 relative overflow-hidden">
            <Header userName="Tutor" onSignOut={signOut} />

            <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
                
                {/* --- Barra de Topo: Navegação e Ações --- */}
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
                            className="flex-1 sm:flex-none bg-red-500 hover:bg-red-600"
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

                {/* --- Área Hero do Pet --- */}
                <div className="relative">
                    {/* Background Card com efeito Glass */}
                    <Card className="border-none shadow-2xl bg-white/80 dark:bg-stone-900/80 backdrop-blur-md overflow-visible mt-12 md:mt-0">
                        <div className="flex flex-col md:flex-row">
                            
                            {/* 1. IMAGEM PADRONIZADA (Float Style) */}
                            {/* - Usa translate negativo no Desktop para dar efeito de destaque */}
                            {/* - Tamanho fixo (w-72) para não quebrar layout */}
                            {/* - Object-cover para cortar excessos sem deformar */}
                            <div className="relative w-full md:w-auto flex justify-center md:block p-6 md:p-0 md:-mt-8 md:-ml-8 mb-4 md:mb-0">
                                <div className="w-64 h-64 md:w-72 md:h-72 rounded-2xl shadow-2xl overflow-hidden border-4 border-white dark:border-stone-700 bg-stone-200">
                                    {pet.foto?.url ? (
                                        <img 
                                            src={pet.foto.url} 
                                            alt={pet.nome} 
                                            className="w-full h-full object-cover transition-transform hover:scale-110 duration-500"
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-stone-400 bg-stone-100 dark:bg-stone-800">
                                            <PawPrint className="w-24 h-24 opacity-20" />
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* 2. Informações do Pet */}
                            <div className="flex-1 p-6 md:py-8 md:pr-8 flex flex-col gap-6">
                                <div className="flex flex-wrap items-start justify-between gap-4">
                                    <div>
                                        <div className="flex items-center gap-3 mb-1">
                                            <h1 className="text-4xl md:text-5xl font-extrabold text-stone-800 dark:text-stone-100 tracking-tight">
                                                {pet.nome}
                                            </h1>
                                            {/* Status Badge (Exemplo: Ativo/Inativo se tivesse) */}
                                            {/* <span className="w-3 h-3 rounded-full bg-green-500 shadow-lg shadow-green-500/50"></span> */}
                                        </div>
                                        <Badge variant="outline" className="text-sm border-amber-500 text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-transparent">
                                            Cod. #{pet.id}
                                        </Badge>
                                    </div>
                                </div>

                                {/* Grid de Atributos */}
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-2">
                                    <div className="flex items-center gap-4 p-4 rounded-xl bg-amber-50 dark:bg-stone-800/50 border border-amber-100 dark:border-stone-700">
                                        <div className="p-3 bg-white dark:bg-stone-700 rounded-full shadow-sm">
                                            <Dog className="w-6 h-6 text-amber-600 dark:text-amber-400" />
                                        </div>
                                        <div>
                                            <p className="text-sm text-muted-foreground">Raça</p>
                                            <p className="text-lg font-semibold text-stone-800 dark:text-stone-200">{pet.raca}</p>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-4 p-4 rounded-xl bg-amber-50 dark:bg-stone-800/50 border border-amber-100 dark:border-stone-700">
                                        <div className="p-3 bg-white dark:bg-stone-700 rounded-full shadow-sm">
                                            <Calendar className="w-6 h-6 text-amber-600 dark:text-amber-400" />
                                        </div>
                                        <div>
                                            <p className="text-sm text-muted-foreground">Idade</p>
                                            <p className="text-lg font-semibold text-stone-800 dark:text-stone-200">
                                                {pet.idade} {pet.idade === 1 ? 'ano' : 'anos'}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Card>
                </div>

                {/* --- Seção de Tutores --- */}
                <div className="space-y-4 pt-4">
                    <div className="flex items-center justify-between flex-wrap gap-4">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-primary/10 rounded-lg">
                                <User className="w-6 h-6 text-primary" />
                            </div>
                            <h2 className="text-2xl font-bold text-stone-800 dark:text-stone-100">
                                Tutores Responsáveis
                            </h2>
                        </div>
                        
                        <Button onClick={handleCadastrarTutor} className="gap-2 bg-primary hover:bg-primary/90 shadow-md shadow-amber-900/20">
                            <UserPlus className="w-4 h-4" />
                            Cadastrar Tutor
                        </Button>
                    </div>
                    
                    {pet.tutores && pet.tutores.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {pet.tutores.map((tutor) => (
                                <Card key={tutor.id} className="group hover:border-primary/50 transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
                                    <CardHeader className="flex flex-row items-center gap-4 pb-3">
                                        <Avatar className="h-14 w-14 border-2 border-white shadow-md">
                                            {tutor.foto?.url ? (
                                                <AvatarImage src={tutor.foto.url} alt={tutor.nome} className="object-cover" />
                                            ) : (
                                                <AvatarFallback className="bg-gradient-to-br from-amber-200 to-orange-300 text-amber-900 font-bold">
                                                    {tutor.nome.substring(0,2).toUpperCase()}
                                                </AvatarFallback>
                                            )}
                                        </Avatar>
                                        <div className="overflow-hidden">
                                            <CardTitle className="text-lg font-bold truncate text-stone-800 dark:text-stone-100" title={tutor.nome}>
                                                {tutor.nome}
                                            </CardTitle>
                                            <Badge variant="secondary" className="mt-1 text-xs">
                                                Principal
                                            </Badge>
                                        </div>
                                    </CardHeader>
                                    <CardContent className="space-y-3 pt-2 text-sm bg-stone-50/50 dark:bg-stone-900/30">
                                        <div className="flex items-center gap-3 text-stone-600 dark:text-stone-400 group-hover:text-stone-900 dark:group-hover:text-stone-200 transition-colors">
                                            <Mail className="w-4 h-4 text-amber-500 shrink-0" />
                                            <span className="truncate" title={tutor.email}>{tutor.email}</span>
                                        </div>
                                        <div className="flex items-center gap-3 text-stone-600 dark:text-stone-400 group-hover:text-stone-900 dark:group-hover:text-stone-200 transition-colors">
                                            <Phone className="w-4 h-4 text-amber-500 shrink-0" />
                                            <span>{tutor.telefone}</span>
                                        </div>
                                        {tutor.endereco && (
                                            <div className="flex items-start gap-3 text-stone-600 dark:text-stone-400 group-hover:text-stone-900 dark:group-hover:text-stone-200 transition-colors">
                                                <MapPin className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                                                <span className="line-clamp-2" title={tutor.endereco}>{tutor.endereco}</span>
                                            </div>
                                        )}
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center p-12 border-2 border-dashed border-amber-200 dark:border-stone-700 rounded-xl bg-white/30 dark:bg-stone-900/30">
                            <div className="p-4 bg-amber-100 dark:bg-stone-800 rounded-full mb-4">
                                <UserPlus className="w-8 h-8 text-amber-600 dark:text-amber-400" />
                            </div>
                            <h3 className="text-lg font-semibold text-stone-800 dark:text-stone-200">Nenhum tutor vinculado</h3>
                            <p className="text-muted-foreground mb-6 text-center max-w-xs">
                                Este pet precisa de um responsável. Cadastre um tutor agora mesmo.
                            </p>
                            <Button variant="outline" onClick={handleCadastrarTutor} className="border-amber-300 text-amber-800 hover:bg-amber-50">
                                Adicionar o primeiro tutor
                            </Button>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}