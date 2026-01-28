"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from 'react-router-dom'; // Importação para navegação

export interface Pet {
  id: number;
  nome: string;
  raca: string;
  idade: number;
  foto: string | null;
}

interface PetCardProps {
  pet: Pet;
}

function getInitials(name: string): string {
  if (!name) return "?";
  return name
    .split(" ")
    .map((word) => word[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

function formatIdade(idade: number): string {
  if (idade < 0) return "Idade inválida";
  if (idade === 0) return "Menos de 1 ano";
  if (idade === 1) return "1 ano";
  return `${idade} anos`;
}

export function PetCard({ pet }: PetCardProps) {

  const navigate = useNavigate();

  return (
    <Card className="hover:scale-[1.02] transition-transform duration-200 cursor-pointer">
      <CardContent className="flex items-center gap-4">
        <Avatar className="size-16 bg-secondary">
          {pet.foto ? (
            <AvatarImage src={pet.foto.url || "/placeholder.svg"} alt={`Foto de ${pet.nome}`} />
          ) : null}
          <AvatarFallback className="bg-primary text-primary-foreground font-bold text-lg">
            {getInitials(pet.nome)}
          </AvatarFallback>
        </Avatar>

        <div className="flex-1 min-w-0">
          <h3 className="font-bold text-lg text-foreground truncate">
            {pet.nome || "Sem nome"}
          </h3>
          <p className="text-muted-foreground text-sm truncate">
            {pet.raca || "Raça desconhecida"}
          </p>
        </div>

        <Badge variant="secondary" className="shrink-0">
          {formatIdade(pet.idade)}
        </Badge>
      </CardContent>
    </Card>
  );
}

export function PetCardSkeleton() {
  return (
    <Card>
      <CardContent className="flex items-center gap-4">
        <div className="size-16 rounded-full bg-muted animate-pulse" />
        <div className="flex-1 space-y-2">
          <div className="h-5 w-32 bg-muted animate-pulse rounded-lg" />
          <div className="h-4 w-24 bg-muted animate-pulse rounded-lg" />
        </div>
        <div className="h-6 w-16 bg-muted animate-pulse rounded-full" />
      </CardContent>
    </Card>
  );
}
