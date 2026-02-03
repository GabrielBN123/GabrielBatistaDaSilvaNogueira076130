import type { Tutor } from "@/interfaces/tutor.interface";
import { CreditCard, Mail, MapPin, Phone, User } from "lucide-react";
import { Badge } from "../ui/badge";

interface TutorDetailProp {
    tutor: Tutor
}


export function TutorDetail({ tutor }: TutorDetailProp) {
    return (
        <div className="lg:col-span-4 space-y-6">

            <div className="relative group">
                <div className="aspect-[4/5] rounded-[32px] overflow-hidden shadow-2xl border-4 border-white dark:border-stone-800 bg-stone-200 relative">
                    {tutor.foto?.url ? (
                        <img
                            src={tutor.foto.url}
                            alt={tutor.nome}
                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                        />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center bg-stone-100 dark:bg-stone-800">
                            <User className="w-24 h-24 text-stone-300 dark:text-stone-600" />
                        </div>
                    )}
                    <div className="absolute top-4 right-4">
                        <Badge className="bg-amber-500 hover:bg-amber-600 border-none shadow-lg">
                            ID #{tutor.id}
                        </Badge>
                    </div>
                </div>
            </div>

            <div className="space-y-6">
                <div>
                    <h1 className="text-3xl md:text-4xl font-black tracking-tight text-stone-900 dark:text-white uppercase italic leading-none mb-2">
                        {tutor.nome}
                    </h1>
                    <Badge variant="outline" className="border-amber-500 text-amber-600 dark:text-amber-400">
                        Cliente #{tutor.id}
                    </Badge>
                </div>

                <div className="grid gap-3">
                    <div className="group bg-white dark:bg-stone-900 p-4 rounded-2xl border border-stone-100 dark:border-stone-800 shadow-sm transition-colors hover:border-amber-200">
                        <div className="flex items-center gap-3 mb-1">
                            <div className="p-2 bg-amber-50 dark:bg-amber-900/20 rounded-lg text-amber-600">
                                <Mail className="w-4 h-4" />
                            </div>
                            <span className="text-xs font-semibold text-stone-400 uppercase tracking-wider">Email</span>
                        </div>
                        <p className="font-medium text-stone-800 dark:text-stone-200 pl-1 truncate" title={tutor.email}>
                            {tutor.email}
                        </p>
                    </div>

                    <div className="group bg-white dark:bg-stone-900 p-4 rounded-2xl border border-stone-100 dark:border-stone-800 shadow-sm transition-colors hover:border-amber-200">
                        <div className="flex items-center gap-3 mb-1">
                            <div className="p-2 bg-amber-50 dark:bg-amber-900/20 rounded-lg text-amber-600">
                                <Phone className="w-4 h-4" />
                            </div>
                            <span className="text-xs font-semibold text-stone-400 uppercase tracking-wider">Telefone</span>
                        </div>
                        <p className="font-medium text-stone-800 dark:text-stone-200 pl-1">
                            {tutor.telefone}
                        </p>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        <div className="bg-white dark:bg-stone-900 p-4 rounded-2xl border border-stone-100 dark:border-stone-800 shadow-sm">
                            <CreditCard className="w-4 h-4 text-stone-400 mb-2" />
                            <span className="text-[10px] text-stone-500 uppercase block">CPF</span>
                            <span className="font-bold text-sm truncate block">{tutor.cpf || "---"}</span>
                        </div>
                        <div className="bg-white dark:bg-stone-900 p-4 rounded-2xl border border-stone-100 dark:border-stone-800 shadow-sm">
                            <MapPin className="w-4 h-4 text-stone-400 mb-2" />
                            <span className="text-[10px] text-stone-500 uppercase block">Região</span>
                            <span className="font-bold text-sm truncate block" title={tutor.endereco}>
                                {tutor.endereco ? tutor.endereco.split(',')[0] : "---"}
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}