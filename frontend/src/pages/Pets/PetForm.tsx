import { useEffect, useState, type FormEvent, type ChangeEvent } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { PetFacade, type PetCreateDTO } from '@/facades/PetFacade';
import { useAuth } from '@/context/AuthContext';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input'; // Seu componente Input
import { Button } from '@/components/ui/button';
import { Save, ArrowLeft, Loader2, Dog, Tag, Calendar, Camera, UploadCloud } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'react-toastify';
import type { PetFormData } from '@/interfaces/pet.interface';

export function PetForm() {
    const { id } = useParams(); 
    const navigate = useNavigate();
    
    const isEditing = !!id; 

    const [loading, setLoading] = useState(false);
    const [initialLoading, setInitialLoading] = useState(isEditing);
    
    const [formData, setFormData] = useState<PetFormData>({
        nome: '',
        raca: '',
        idade: ''
    });

    const [fotoPreview, setFotoPreview] = useState<string | null>(null); // Para mostrar na tela
    const [arquivoFoto, setArquivoFoto] = useState<File | null>(null);   // O arquivo real para envio

    useEffect(() => {
        if (isEditing) {
            carregarDadosPet(id);
        }
    }, [id]);

    async function carregarDadosPet(petId: string) {
        try {
            const data = await PetFacade.getById(Number(petId));
            
            setFormData({
                nome: data.nome,
                raca: data.raca,
                idade: data.idade
            });

            if (data.foto && data.foto.url) {
                setFotoPreview(data.foto.url);
            }

        } catch (error) {
            console.error(error);
            alert("Erro ao carregar dados do pet.");
            navigate('/'); 
        } finally {
            setInitialLoading(false);
        }
    }

    const handleChange = (val: string, name: string) => {
        setFormData(prev => ({ ...prev, [name]: val }));
    };

    const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setArquivoFoto(file);
            const previewURL = URL.createObjectURL(file);
            setFotoPreview(previewURL);
        }
    };

    async function handleSubmit(e: FormEvent) {
        e.preventDefault();
        setLoading(true);

        try {
            const payload: PetCreateDTO = {
                nome: formData.nome,
                raca: formData.raca,
                idade: Number(formData.idade)
            };

            let PetID = Number(id);

            if (isEditing) {
                await PetFacade.update(PetID, payload);
            } else {
                const novoPet = await PetFacade.create(payload);
                PetID = novoPet.id; 
                console.log('Pet cadastrado');
            }

            if (arquivoFoto && PetID) {
                await PetFacade.uploadImage(PetID, arquivoFoto);
            }
            
            toast.success(isEditing ? 'Pet atualizado com sucesso!' : 'Pet cadastrado com sucesso!');
            navigate(`/pets/${PetID}`); 

        } catch (error) {
            console.error("Erro ao salvar:", error);
            toast.error('Ocorreu um erro. Verifique os dados e tente novamente.');
        } finally {
            setLoading(false);
        }
    }

    if (initialLoading) {
        return (
            <div className="min-h-screen p-4 bg-gradient-to-b from-amber-100 to-orange-200 dark:from-stone-950 dark:to-neutral-900">
                <Skeleton className="h-12 w-full max-w-2xl mx-auto mt-10 rounded-xl" />
                <Skeleton className="h-96 w-full max-w-2xl mx-auto mt-4 rounded-xl" />
            </div>
        );
    }

    return (
        <div className="min-h-screen min-w-screen from-amber-100 to-orange-200 dark:from-stone-950 dark:to-neutral-900 p-4 relative overflow-hidden">
            <main className="max-w-2xl mx-auto px-4 py-8">
                <Card>
                    <form onSubmit={handleSubmit}>
                        <CardHeader>
                            <CardTitle className="text-2xl flex items-center gap-2">
                                {isEditing ? 'Editar Pet' : 'Novo Pet'}
                            </CardTitle>
                        </CardHeader>

                        <CardContent className="space-y-6">
                            
                            <div className="flex flex-col items-center justify-center gap-4 p-4 border-2 border-dashed border-amber-300 dark:border-stone-700 rounded-xl bg-amber-50/50 dark:bg-stone-900/50">
                                <div className="relative w-32 h-32 rounded-full overflow-hidden border-4 border-white shadow-md bg-stone-200 group cursor-pointer">
                                    <input 
                                        type="file" 
                                        id="foto-upload" 
                                        accept="image/*"
                                        className="hidden"
                                        onChange={handleFileChange}
                                    />
                                    
                                    <label htmlFor="foto-upload" className="w-full h-full flex items-center justify-center cursor-pointer relative">
                                        {fotoPreview ? (
                                            <img src={fotoPreview} alt="Preview" className="w-full h-full object-cover" />
                                        ) : (
                                            <Dog className="w-16 h-16 text-stone-400" />
                                        )}
                                        
                                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                            <Camera className="w-8 h-8 text-white" />
                                        </div>
                                    </label>
                                </div>
                                <label 
                                    htmlFor="foto-upload" 
                                    className="cursor-pointer flex items-center gap-2 text-amber-700 dark:text-amber-500 font-semibold text-sm hover:underline"
                                >
                                    <UploadCloud className="w-4 h-4" />
                                    {fotoPreview ? "Alterar foto" : "Adicionar foto"}
                                </label>
                            </div>

                            <div className="space-y-4">
                                <Input
                                    label="Nome do Pet"
                                    type="text"
                                    placeholder="Ex: Rex, Mel..."
                                    value={formData.nome}
                                    onChange={(val) => handleChange(val, 'nome')} // Adaptação para seu onChange
                                    icon={Dog}
                                    required
                                />

                                <Input
                                    label='Raça'
                                    type='text'
                                    placeholder="Ex: Vira-lata, Poodle..."
                                    value={formData.raca}
                                    onChange={(val) => handleChange(val, 'raca')}
                                    icon={Tag}
                                    required
                                />

                                <Input
                                    label="Idade"
                                    type="number"
                                    placeholder="Ex: 3"
                                    value={String(formData.idade)}
                                    onChange={(val) => handleChange(val, 'idade')}
                                    icon={Calendar}
                                    required
                                />
                            </div>
                        </CardContent>

                        <CardFooter className="flex justify-between gap-4 mt-2">
                            <Button 
                                type="button" 
                                variant="outline" 
                                onClick={() => navigate(-1)}
                                className="w-full sm:w-auto"
                            >
                                <ArrowLeft className="w-4 h-4 mr-2" />
                                Cancelar
                            </Button>

                            <Button 
                                type="submit" 
                                className="w-full sm:w-auto bg-primary text-primary-foreground hover:bg-primary/90"
                                disabled={loading}
                            >
                                {loading ? (
                                    <>
                                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                        Salvando...
                                    </>
                                ) : (
                                    <>
                                        <Save className="w-4 h-4 mr-2" />
                                        {isEditing ? 'Salvar Alterações' : 'Cadastrar Pet'}
                                    </>
                                )}
                            </Button>
                        </CardFooter>
                    </form>
                </Card>
            </main>
        </div>
    );
}