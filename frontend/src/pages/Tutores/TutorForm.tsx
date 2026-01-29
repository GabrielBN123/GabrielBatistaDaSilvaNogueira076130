import { useEffect, useState, type FormEvent, type ChangeEvent } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { TutorFacade } from '@/facades/TutorFacade';
import { useAuth } from '@/context/AuthContext';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
	Save,
	ArrowLeft,
	Loader2,
	User,
	Mail,
	Phone,
	MapPin,
	CreditCard,
	Camera,
	UploadCloud
} from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'react-toastify';
import type { TutorFormData } from '@/interfaces/tutor.interface';


export function TutorForm() {
	const { id } = useParams();
	const navigate = useNavigate();
	const { signOut } = useAuth();

	const isEditing = !!id;

	const [loading, setLoading] = useState(false);
	const [initialLoading, setInitialLoading] = useState(isEditing);

	// Estados do formulário
	const [formData, setFormData] = useState<TutorFormData>({
		nome: '',
		email: '',
		telefone: '',
		endereco: '',
		cpf: ''
	});

	// Estados para Imagem
	const [fotoPreview, setFotoPreview] = useState<string | null>(null);
	const [arquivoFoto, setArquivoFoto] = useState<File | null>(null);

	useEffect(() => {
		if (isEditing) {
			carregarDadosTutor(id);
		}
	}, [id]);

	async function carregarDadosTutor(tutorId: string) {
		try {
			const data = await TutorFacade.getById(Number(tutorId));

			setFormData({
				nome: data.nome,
				email: data.email,
				telefone: data.telefone,
				endereco: data.endereco,
				cpf: data.cpf || ''
			});

			if (data.foto && data.foto.url) {
				setFotoPreview(data.foto.url);
			}

		} catch (error) {
			console.error(error);
			alert("Erro ao carregar dados do tutor.");
			navigate('/tutores');
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
			const payload = {
				nome: formData.nome,
				email: formData.email,
				telefone: formData.telefone,
				endereco: formData.endereco,
				cpf: formData.cpf.toString().replace(/\D/g, '')
			};

			let tutorId = Number(id);

			if (isEditing) {
				await TutorFacade.update(tutorId, payload);
			} else {
				const novoTutor = await TutorFacade.create(payload);
				tutorId = novoTutor.id;
			}

			if (arquivoFoto && tutorId) {
				await TutorFacade.uploadImage(tutorId, arquivoFoto);
			}

			toast.success(isEditing ? 'Tutor atualizado com sucesso!' : 'Tutor cadastrado com sucesso!');
			navigate(`/tutores/${tutorId}`);

		} catch (error) {
			console.error("Erro ao salvar:", error);
			toast.error('Ocorreu um erro ao salvar o tutor. Verifique os dados.');
		} finally {
			setLoading(false);
		}
	}

	if (initialLoading) {
		return (
			<div className="min-h-screen p-4 from-amber-100 to-orange-200 dark:from-stone-950 dark:to-neutral-900">
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
								{isEditing ? 'Editar Tutor' : 'Novo Tutor'}
							</CardTitle>
						</CardHeader>

						<CardContent className="space-y-6">

							<div className="flex flex-col items-center justify-center gap-4 p-4 border-2 border-dashed border-amber-300 dark:border-stone-700 rounded-xl bg-amber-50/50 dark:bg-stone-900/50">
								<div className="relative w-32 h-32 rounded-full overflow-hidden border-4 border-white shadow-md bg-stone-200 group cursor-pointer">
									<input
										type="file"
										id="foto-tutor-upload"
										accept="image/*"
										className="hidden"
										onChange={handleFileChange}
									/>

									<label htmlFor="foto-tutor-upload" className="w-full h-full flex items-center justify-center cursor-pointer relative">
										{fotoPreview ? (
											<img src={fotoPreview} alt="Preview" className="w-full h-full object-cover" />
										) : (
											<User className="w-16 h-16 text-stone-400" />
										)}

										<div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
											<Camera className="w-8 h-8 text-white" />
										</div>
									</label>
								</div>
								<label
									htmlFor="foto-tutor-upload"
									className="cursor-pointer flex items-center gap-2 text-amber-700 dark:text-amber-500 font-semibold text-sm hover:underline"
								>
									<UploadCloud className="w-4 h-4" />
									{fotoPreview ? "Alterar foto" : "Adicionar foto"}
								</label>
							</div>

							<div className="space-y-4">
								<Input
									label="Nome Completo"
									type="text"
									placeholder="Ex: João da Silva"
									value={formData.nome}
									onChange={(val) => handleChange(val, 'nome')}
									icon={User}
									required
								/>

								<Input
									label="E-mail"
									type="email"
									placeholder="Ex: joao@email.com"
									value={formData.email}
									onChange={(val) => handleChange(val, 'email')}
									icon={Mail}
									required
								/>

								<Input
									label="Telefone"
									type="text"
									placeholder="Ex: (11) 99999-9999"
									value={formData.telefone}
									onChange={(val) => handleChange(val, 'telefone')}
									icon={Phone}
									mask="phone"
									required
								/>

								<Input
									label="Endereço"
									type="text"
									placeholder="Ex: Rua das Flores, 123"
									value={formData.endereco}
									onChange={(val) => handleChange(val, 'endereco')}
									icon={MapPin}
									required
								/>

								<Input
									label="CPF"
									type="text"
									placeholder="Ex: 123.456.789-00"
									mask="cpf"
									value={String(formData.cpf)}
									onChange={(val) => handleChange(val, 'cpf')}
									icon={CreditCard}
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
										{isEditing ? 'Salvar Alterações' : 'Cadastrar Tutor'}
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