import type { Pet } from "@/interfaces/pet.interface";
import { Calendar, Dog, PawPrint, ShieldCheck } from "lucide-react";
import { Badge } from "../ui/badge";

interface PetDetailProps {
    pet: Pet,
}

export function PetDetail({pet}:PetDetailProps) {
    return (
        <div className="lg:col-span-4 space-y-6">
            <div className="relative group">
                <div className="aspect-square rounded-3xl overflow-hidden shadow-2xl border-4 border-white dark:border-stone-800 bg-stone-100 relative">
                    {pet.foto?.url ? (
                        <div className={`w-full h-full`}>
                            <div className={`w-full h-full float-left absolute blur-sm transition-transform duration-700 bg-cover bg-center bg-no-repeat`} style={{ backgroundImage: `url('${pet.foto?.url}')` }}></div>
                            <img src={pet.foto.url} alt={pet.nome} className="absolute w-full h-full object-contain transition-transform duration-700 group-hover:scale-105" />
                        </div>
                    ) : (
                        <div className="w-full h-full flex items-center justify-center bg-amber-50 dark:bg-stone-900">
                            <PawPrint className="w-20 h-20 text-amber-200 dark:text-stone-800" />
                        </div>
                    )}
                    <div className="absolute top-4 right-4">
                        <Badge className="bg-amber-500 hover:bg-amber-600 border-none shadow-lg">
                            ID #{pet.id}
                        </Badge>
                    </div>
                </div>
            </div>

            <div className="space-y-4">
                <div>
                    <h1 className="text-4xl font-black tracking-tight text-stone-900 dark:text-white uppercase italic">
                        {pet.nome}
                    </h1>
                    <p className="text-amber-600 dark:text-amber-400 font-medium flex items-center gap-2">
                        <ShieldCheck className="w-4 h-4" /> Registro Verificado
                    </p>
                </div>

                <div className="grid grid-cols-2 gap-3">
                    <div className="bg-white dark:bg-stone-900 p-4 rounded-2xl border border-stone-100 dark:border-stone-800 shadow-sm">
                        <Dog className="w-5 h-5 text-amber-500 mb-2" />
                        <span className="text-xs text-stone-500 block">Espécie/Raça</span>
                        <span className="font-bold text-sm truncate block">{pet.raca}</span>
                    </div>
                    <div className="bg-white dark:bg-stone-900 p-4 rounded-2xl border border-stone-100 dark:border-stone-800 shadow-sm">
                        <Calendar className="w-5 h-5 text-amber-500 mb-2" />
                        <span className="text-xs text-stone-500 block">Idade</span>
                        <span className="font-bold text-sm block">{pet.idade} {pet.idade === 1 ? 'ano' : 'anos'}</span>
                    </div>
                </div>
            </div>
        </div>
    )
}