import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Button } from "../ui/button";
import { Dog, ExternalLink, PawPrint, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import type { Pet } from "@/interfaces/pet.interface";

interface ListaPetsProps {
    pet: Pet,
    Unlink: (id: number) => void;
}

export function ListaPets({ pet, Unlink }: ListaPetsProps) {

    const navigate = useNavigate();

    return (
        <div
            className="group bg-white dark:bg-stone-900 p-4 rounded-2xl border border-stone-200 dark:border-stone-800 hover:border-amber-300 dark:hover:border-amber-700 transition-all duration-300 flex flex-col md:flex-row items-center gap-5 shadow-sm hover:shadow-md"
        >
            <div className="relative">
                <Avatar className="h-16 w-16 border-2 border-stone-100 dark:border-stone-800 shadow-sm">
                    <AvatarImage src={pet.foto?.url} className="object-cover" />
                    <AvatarFallback className="bg-gradient-to-br from-amber-100 to-orange-200 text-amber-800 font-bold">
                        <Dog className="w-6 h-6 opacity-50" />
                    </AvatarFallback>
                </Avatar>
                <div className="absolute -bottom-1 -right-1 bg-white dark:bg-stone-800 rounded-full p-1 border border-stone-100">
                    <PawPrint className="w-3 h-3 text-amber-500" />
                </div>
            </div>

            <div className="flex-1 space-y-1 text-center md:text-left min-w-0">
                <h3 className="font-bold text-lg text-stone-900 dark:text-stone-100 truncate group-hover:text-amber-600 transition-colors">
                    {pet.nome}
                </h3>
                <div className="flex flex-wrap justify-center md:justify-start gap-x-4 gap-y-1 text-sm text-stone-500">
                    <span className="flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-stone-300" />
                        {pet.raca}
                    </span>
                    <span className="flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-stone-300" />
                        {pet.idade} {pet.idade === 1 ? 'ano' : 'anos'}
                    </span>
                </div>
            </div>

            <div className="flex items-center gap-2 w-full md:w-auto mt-2 md:mt-0">
                <Button
                    variant="ghost"
                    className="flex-1 md:flex-none text-stone-500 hover:text-amber-600 hover:bg-amber-50 dark:hover:bg-amber-900/20"
                    onClick={() => navigate(`/pets/${pet.id}`)}
                >
                    Ver Pet
                    <ExternalLink className="w-4 h-4 ml-2" />
                </Button>

                <div className="w-px h-6 bg-stone-200 dark:bg-stone-700 hidden md:block" />

                <Button
                    variant="ghost"
                    size="icon"
                    className="text-stone-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20"
                    onClick={() => Unlink(pet.id)}
                    title="Desvincular pet"
                >
                    <Trash2 className="w-4 h-4" />
                </Button>
            </div>
        </div>
    )
}