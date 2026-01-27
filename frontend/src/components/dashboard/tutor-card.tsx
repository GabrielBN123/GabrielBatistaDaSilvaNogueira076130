import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { Mail, Phone } from "lucide-react";

interface Tutor {
  id: number;
  nome: string;
  email: string;
  telefone: string;
  foto?: { url: string } | null;
}

interface TutorCardProps {
  tutor: Tutor;
}

export function TutorCard({ tutor }: TutorCardProps) {
  return (
    <Card className="h-full overflow-hidden hover:shadow-md transition-shadow bg-white/80 dark:bg-stone-900/80 border-amber-200 dark:border-stone-700">
      <CardContent className="p-4 flex items-center gap-4">
        {/* Avatar */}
        <Avatar className="h-14 w-14 border-2 border-amber-100 dark:border-stone-600">
          {tutor.foto?.url ? (
            <AvatarImage src={tutor.foto.url} alt={tutor.nome} className="object-cover" />
          ) : (
            <AvatarFallback className="bg-amber-100 text-amber-700 dark:bg-amber-900 dark:text-amber-200 font-bold">
              {tutor.nome.substring(0, 2).toUpperCase()}
            </AvatarFallback>
          )}
        </Avatar>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <h3 className="font-bold text-stone-800 dark:text-stone-100 truncate text-lg">
            {tutor.nome}
          </h3>
          
          <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
            <Mail className="w-3 h-3 shrink-0" />
            <span className="truncate">{tutor.email}</span>
          </div>
          
          <div className="flex items-center gap-2 text-sm text-muted-foreground mt-0.5">
            <Phone className="w-3 h-3 shrink-0" />
            <span className="truncate">{tutor.telefone}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export function TutorCardSkeleton() {
  return (
    <Card className="h-24 bg-white/50 dark:bg-stone-900/50">
      <CardContent className="p-4 flex items-center gap-4 h-full">
        <Skeleton className="h-14 w-14 rounded-full" />
        <div className="space-y-2 flex-1">
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-3 w-1/2" />
        </div>
      </CardContent>
    </Card>
  );
}