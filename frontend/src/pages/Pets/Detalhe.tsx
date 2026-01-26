import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { PetFacade } from '@/facades/PetFacade'; // Ajuste o import conforme sua estrutura
import { useAuth } from '@/context/AuthContext';
import { Header } from '@/components/ui/header';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton'; // Se tiver, ou use div com animate-pulse
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  ArrowLeft, 
  Mail, 
  Phone, 
  MapPin, 
  User, 
  Dog, 
  Calendar 
} from 'lucide-react';

// Interfaces baseadas no JSON fornecido
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

export function Detalhe() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { signOut } = useAuth();

    const [pet, setPet] = useState<PetDetalheData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (id) {
            carregarDetalhes(id);
        }
    }, [id]);

    async function carregarDetalhes(petId: string) {
        setLoading(true);
        try {
            // Supondo que você crie este método no PetFacade
            // const data = await PetFacade.getById(petId);
            
            // MOCK TEMPORÁRIO PARA VOCÊ TESTAR (Remova isso e use o Facade real)
            /* const data = await PetFacade.getById(petId);
            */
           
            // Exemplo de como chamar (ajuste para seu facade real):
            const data = await PetFacade.getById(Number(petId));
            setPet(data);

        } catch (err) {
            console.error(err);
            setError("Não foi possível carregar os detalhes do pet.");
        } finally {
            setLoading(false);
        }
    }

    const handleVoltar = () => {
        navigate(-1); // Volta para a página anterior
    };

    // Placeholder de carregamento
    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-b from-amber-100 to-orange-200 dark:from-stone-950 dark:to-neutral-900 p-4">
                 <Header userName="Tutor" onSignOut={signOut} />
                 <main className="max-w-4xl mx-auto px-4 py-8 space-y-6">
                    <Skeleton className="h-10 w-32" />
                    <Skeleton className="h-64 w-full rounded-xl" />
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Skeleton className="h-40 w-full" />
                        <Skeleton className="h-40 w-full" />
                    </div>
                 </main>
            </div>
        );
    }

    if (error || !pet) {
        return (
            <div className="min-h-screen bg-gradient-to-b from-amber-100 to-orange-200 p-4 flex flex-col items-center justify-center text-center">
                 <h2 className="text-2xl font-bold text-stone-800 mb-4">{error || "Pet não encontrado"}</h2>
                 <Button onClick={handleVoltar}>Voltar para o Dashboard</Button>
            </div>
        );
    }

    return (
        <div className="min-h-screen min-w-screen bg-gradient-to-b from-amber-100 to-orange-200 dark:from-stone-950 dark:to-neutral-900 p-4 relative overflow-hidden">
            <Header userName="Tutor" onSignOut={signOut} />

            <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
                
                {/* Botão Voltar */}
                <Button 
                    variant="ghost" 
                    onClick={handleVoltar} 
                    className="gap-2 hover:bg-white/20 -ml-2 text-stone-700 dark:text-stone-200"
                >
                    <ArrowLeft className="w-5 h-5" />
                    Voltar
                </Button>

                {/* Card Principal do Pet */}
                <Card className="overflow-hidden border-none shadow-lg bg-white/90 dark:bg-stone-900/90 backdrop-blur-sm">
                    <div className="flex flex-col md:flex-row">
                        {/* Imagem do Pet (Lado esquerdo ou Topo) */}
                        <div className="w-full md:w-1/3 h-64 md:h-auto relative bg-stone-200 dark:bg-stone-800">
                            {pet.foto?.url ? (
                                <img 
                                    src={pet.foto.url} 
                                    alt={pet.nome} 
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-stone-400">
                                    <Dog className="w-20 h-20" />
                                </div>
                            )}
                        </div>

                        {/* Informações do Pet */}
                        <div className="flex-1 p-6 md:p-8 flex flex-col justify-center">
                            <div className="flex items-center justify-between mb-4">
                                <h1 className="text-3xl md:text-4xl font-bold text-stone-800 dark:text-stone-100">{pet.nome}</h1>
                                <Badge variant="secondary" className="text-lg px-3 py-1 bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-100 hover:bg-amber-200">
                                    #{pet.id}
                                </Badge>
                            </div>

                            <div className="space-y-3">
                                <div className="flex items-center gap-3 text-lg text-stone-600 dark:text-stone-300">
                                    <Dog className="w-5 h-5 text-primary" />
                                    <span className="font-semibold">Raça:</span> {pet.raca}
                                </div>
                                <div className="flex items-center gap-3 text-lg text-stone-600 dark:text-stone-300">
                                    <Calendar className="w-5 h-5 text-primary" />
                                    <span className="font-semibold">Idade:</span> {pet.idade} {pet.idade === 1 ? 'ano' : 'anos'}
                                </div>
                            </div>
                        </div>
                    </div>
                </Card>

                {/* Seção de Tutores */}
                <div>
                    <h2 className="text-2xl font-bold text-stone-800 dark:text-stone-100 mb-4 flex items-center gap-2">
                        <User className="w-6 h-6" />
                        Tutores Responsáveis
                    </h2>
                    
                    {pet.tutores && pet.tutores.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {pet.tutores.map((tutor) => (
                                <Card key={tutor.id} className="hover:shadow-md transition-shadow duration-200">
                                    <CardHeader className="flex flex-row items-center gap-4 pb-2">
                                        <Avatar className="h-12 w-12 border-2 border-primary/20">
                                            {tutor.foto?.url ? (
                                                <AvatarImage src={tutor.foto.url} alt={tutor.nome} />
                                            ) : (
                                                <AvatarFallback className="bg-amber-100 text-amber-700">
                                                    {tutor.nome.substring(0,2).toUpperCase()}
                                                </AvatarFallback>
                                            )}
                                        </Avatar>
                                        <div className="overflow-hidden">
                                            <CardTitle className="text-lg truncate" title={tutor.nome}>
                                                {tutor.nome}
                                            </CardTitle>
                                            <p className="text-sm text-muted-foreground truncate">ID: {tutor.id}</p>
                                        </div>
                                    </CardHeader>
                                    <CardContent className="space-y-3 pt-2 text-sm">
                                        <div className="flex items-center gap-2 text-stone-600 dark:text-stone-400">
                                            <Mail className="w-4 h-4 text-primary shrink-0" />
                                            <span className="truncate" title={tutor.email}>{tutor.email}</span>
                                        </div>
                                        <div className="flex items-center gap-2 text-stone-600 dark:text-stone-400">
                                            <Phone className="w-4 h-4 text-primary shrink-0" />
                                            <span>{tutor.telefone}</span>
                                        </div>
                                        {tutor.endereco && (
                                            <div className="flex items-start gap-2 text-stone-600 dark:text-stone-400">
                                                <MapPin className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                                                <span className="line-clamp-2" title={tutor.endereco}>{tutor.endereco}</span>
                                            </div>
                                        )}
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    ) : (
                        <Card className="p-8 text-center bg-white/50 dark:bg-stone-900/50">
                            <div className="flex flex-col items-center justify-center text-muted-foreground gap-2">
                                <User className="w-12 h-12 opacity-20" />
                                <p>Este pet ainda tem tutores.</p>
                            </div>
                        </Card>
                    )}
                </div>
            </main>
        </div>
    );
}