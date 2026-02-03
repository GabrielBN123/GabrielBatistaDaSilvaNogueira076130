import type { Tutor } from "@/interfaces/tutor.interface";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Button } from "../ui/button";
import { ExternalLink, Mail, Phone, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface ListaTutoresProps {
    tutor: Tutor,
    Unlink: (id: number) => void;
}

export function ListaTutores({tutor, Unlink}:ListaTutoresProps) {

    const navigate = useNavigate();

    return (
        <div
            key={tutor.id}
            className="group bg-white dark:bg-stone-900 hover:bg-amber-50/50 dark:hover:bg-stone-800/50 p-4 rounded-2xl border border-stone-200 dark:border-stone-800 transition-all duration-300 flex flex-col md:flex-row items-center gap-6"
        >
            <Avatar className="h-16 w-16 border-2 border-amber-100">
                <AvatarImage src={tutor.foto?.url} className="object-cover" />
                <AvatarFallback className="bg-amber-100 text-amber-700 font-bold">
                    {tutor.nome.substring(0, 2).toUpperCase()}
                </AvatarFallback>
            </Avatar>

            <div className="flex-1 space-y-1 text-center md:text-left">
                <h3 className="font-bold text-lg group-hover:text-amber-700 dark:group-hover:text-amber-400 transition-colors">
                    {tutor.nome}
                </h3>
                <div className="flex flex-wrap justify-center md:justify-start gap-4 text-sm text-stone-500">
                    <span className="flex items-center gap-1.5"><Mail className="w-3.5 h-3.5 text-amber-500" /> {tutor.email}</span>
                    <span className="flex items-center gap-1.5"><Phone className="w-3.5 h-3.5 text-amber-500" /> {tutor.telefone}</span>
                </div>
            </div>

            <div className="flex gap-2">
                <Button
                    variant="ghost"
                    className="flex-1 md:flex-none text-stone-500 hover:text-amber-600 hover:bg-amber-50 dark:hover:bg-amber-900/20"
                    onClick={() => navigate(`/tutores/${tutor.id}`)}
                >
                    Ver Tutor
                    <ExternalLink className="w-4 h-4 ml-2" />
                </Button>
                <Button size="icon" variant="ghost" className="rounded-full hover:bg-red-50 text-red-500" onClick={() => Unlink(tutor.id)}>
                    <Trash2 className="w-4 h-4" />
                </Button>
            </div>
        </div>
    )
}