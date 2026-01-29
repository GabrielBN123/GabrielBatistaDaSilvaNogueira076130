import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Skeleton } from '@/components/ui/skeleton';
import { PetFacade } from '@/facades/PetFacade';
import { TutorFacade } from '@/facades/TutorFacade';
import { 
    PawPrint, 
    Users, 
    ArrowRight, 
    Activity 
} from 'lucide-react';

export function Dashboard() {
    const navigate = useNavigate();

    // Estado para contadores
    const [stats, setStats] = useState({ pets: 0, tutores: 0 });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchStats() {
            try {
                // Buscamos apenas 1 item para pegar o 'total' do paginado de forma leve
                const [petsData, tutoresData] = await Promise.all([
                    PetFacade.getAll('', 0, '', 1),
                    TutorFacade.getAll(0, 1)
                ]);

                setStats({
                    pets: petsData.total || 0,
                    tutores: tutoresData.total || 0
                });
            } catch (error) {
                console.error("Erro ao carregar estatísticas", error);
            } finally {
                setLoading(false);
            }
        }
        fetchStats();
    }, []);

    const cards = [
        {
            title: "Pets",
            count: stats.pets,
            label: "Animais Cadastrados",
            icon: PawPrint,
            color: "text-amber-600 dark:text-amber-500",
            bgIcon: "bg-amber-100 dark:bg-amber-900/30",
            borderHover: "hover:border-amber-300 dark:hover:border-amber-700",
            route: "/pets",
            description: "Gerencie fichas médicas, fotos e dados dos pets."
        },
        {
            title: "Tutores",
            count: stats.tutores,
            label: "Responsáveis",
            icon: Users,
            color: "text-blue-600 dark:text-blue-500",
            bgIcon: "bg-blue-100 dark:bg-blue-900/30",
            borderHover: "hover:border-blue-300 dark:hover:border-blue-700",
            route: "/tutores",
            description: "Administre contatos e vínculos dos proprietários."
        }
    ];

    return (
        <div className="min-h-screen min-w-screen from-amber-50 via-orange-50 to-amber-100 dark:from-stone-950 dark:via-neutral-900 dark:to-stone-950 p-4 font-sans relative overflow-hidden">
            <main className="max-w-5xl mx-auto py-12 px-4 sm:px-6 relative z-10">
                
                <div className="mb-12 text-center md:text-left animate-in fade-in slide-in-from-bottom-4 duration-700">
                    <h1 className="text-4xl md:text-5xl font-black text-stone-800 dark:text-stone-100 tracking-tight mb-2">
                        Painel de Controle
                    </h1>
                    <p className="text-lg text-stone-500 dark:text-stone-400 max-w-2xl">
                        Bem-vindo de volta!
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {cards.map((card, index) => (
                        <div 
                            key={card.title}
                            onClick={() => navigate(card.route)}
                            className={`
                                group relative cursor-pointer
                                bg-white/60 dark:bg-stone-900/60 backdrop-blur-xl
                                border-2 border-white/50 dark:border-stone-800 ${card.borderHover}
                                rounded-[2rem] p-8 shadow-xl shadow-stone-200/50 dark:shadow-none
                                transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl
                            `}
                        >
                            <div className={`absolute inset-0 rounded-[2rem] opacity-0 group-hover:opacity-10 transition-opacity duration-500 bg-current ${card.color}`} />

                            <div className="flex flex-col h-full justify-between relative z-10">
                                <div>
                                    <div className="flex justify-between items-start mb-6">
                                        <div className={`p-4 rounded-2xl ${card.bgIcon} ${card.color} shadow-inner`}>
                                            <card.icon className="w-8 h-8" />
                                        </div>
                                        <div className="bg-white/50 dark:bg-stone-800/50 px-3 py-1 rounded-full border border-stone-100 dark:border-stone-700">
                                            <ArrowRight className="w-5 h-5 text-stone-400 group-hover:text-stone-800 dark:group-hover:text-stone-200 transition-colors" />
                                        </div>
                                    </div>

                                    <h2 className="text-3xl font-bold text-stone-800 dark:text-stone-100 mb-1">
                                        {card.title}
                                    </h2>
                                    <p className="text-stone-500 dark:text-stone-400 font-medium mb-6">
                                        {card.description}
                                    </p>
                                </div>

                                <div className="mt-4 pt-6 border-t border-stone-200/50 dark:border-stone-800">
                                    {loading ? (
                                        <Skeleton className="h-10 w-32 rounded-lg" />
                                    ) : (
                                        <div className="flex items-baseline gap-2">
                                            <span className={`text-5xl font-black ${card.color}`}>
                                                {card.count}
                                            </span>
                                            <span className="text-stone-400 font-medium uppercase text-sm tracking-wider">
                                                {card.label}
                                            </span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="mt-16 flex justify-center opacity-60">
                    <div className="flex items-center gap-2 text-sm text-stone-400 bg-stone-100/50 dark:bg-stone-900/50 px-4 py-2 rounded-full backdrop-blur-sm">
                        <Activity className="w-4 h-4 animate-pulse text-green-500" />
                        Sistema Operacional e Conectado
                    </div>
                </div>

            </main>
        </div>
    );
}