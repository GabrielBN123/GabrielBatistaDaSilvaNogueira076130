# Processo Seletivo - Engenheiro da Computação Sênior

Este repositório contém a aplicação frontend desenvolvida para o processo seletivo da SEPLAG. O sistema foi construído com foco em escalabilidade, tipagem forte e isolamento de ambiente via Docker.

## 📋 Dados da Inscrição
- **Inscrição:** 16319
- **Candidato:** Gabriel Batista
- **Processo Seletivo:** PROCESSO SELETIVO CONJUNTO Nº 001/2026/SEPLAG e demais Órgãos
- **Cargo:** Engenheiro da Computação - Sênior

---

## 🛠️ Tecnologias e Implementações

A aplicação utiliza o ecossistema moderno do React para garantir performance e manutenibilidade:

* **React + TypeScript:** Base do projeto para garantir segurança de tipos e produtividade.
* **Tailwind CSS:** Utilizado para estilização rápida e responsiva com foco em utilitários.
* **Shadcn/UI:** Biblioteca de componentes de interface altamente acessíveis e customizáveis.
* **Lucide React:** Conjunto de ícones leves e consistentes para toda a interface.
* **React Router DOM:** Gestão de rotas complexas, incluindo proteção de rotas (`PrivateRoute`) e carregamento dinâmico (`Suspense`).
* **Context API:** Utilizada para gestão de estado global através do `AuthProvider` (autenticação) e `ModalProvider`.
* **React Toastify:** Implementado para notificações visuais (`ToastContainer`) de feedback ao usuário.
* **Docker:** Containerização completa da aplicação para garantir isolamento e consistência do ambiente.

---

## 🚀 Como Executar o Sistema

Siga os passos abaixo para configurar e rodar a aplicação localmente:

### 1. Pré-requisitos
Certifique-se de que você possui o **Docker** instalado:
- [Download Docker Desktop](https://www.docker.com/products/docker-desktop/)

Após a instalação, confirme se o serviço está ativo:
```bash
docker --version

```

### 2. Clonar o Projeto
Clone o repositório no seu ambiente local
```bash
    git clone https://github.com/GabrielBN123/GabrielBatistaDaSilvaNogueira076130.git
```
Acesse a pasta do repositório
```bash
    cd GabrielBatistaDaSilvaNogueira076130
```

### 3. Inicialização via Docker
Limpa containers, imagens e volumes antigos do projeto
```bash
    docker-compose down --rmi all --volumes --remove-orphans
```

Build e inicialização do container
```bash
    docker-compose up -d --build
```
### 4. Acesso
Abra o seu navegador e acesse o link gerado pelo Docker: 👉 http://localhost:3000

#### Estrutura de Rotas e Acessos

Públicas

* **/login:** Interface de acesso inicial.
* **/health:** Rota de diagnóstico (Deve exibir: UP).

Privadas (Requerem Autenticação)

* **/**: Dashboard (Visão geral).

Pets: 
* **/pets,** Lista de pets
* **/pets/novo**  Cadastro de pets
* **/pets/editar/:id,** Edição de pets
* **/pets/:id**. Detalhes sobre o pet

Tutores: 
* **/tutores**, Lista de Tutores
* **/tutores/novo**, Cadastro de Tutores
* **/tutores/editar/:id**, Edição de Tutores
* **/tutores/:id**. Detalhes sobre o tutor

Vínculos: 
* **/tutores/:id/pet/novo** Vínculo de pet e tutor com base no Tutor
* **/pets/:id/tutor/novo** Vínculo de pet e tutor com base no Pet

### Passo a Passo para Teste e Validação

1. .Para validar se está tudo certo e sem erros, siga este roteiro:

2. Validar Ambiente: Após o comando do Docker, verifique se o container está rodando com docker ps.

3. Acesso ao Login: Abra o navegador no endereço indicado. A aplicação deve carregar a tela de login.

4. Verificar Saúde: Acesse a rota /health para confirmar se o servidor frontend está respondendo corretamente.

    Fluxo de Operação:

    *    Realize o login para entrar na área protegida (Dashboard).

    *    Acesse a tela de Tutores e realize o cadastro de um novo tutor.

    *    Acesse a tela de Pets e cadastre um animal.

    *    Utilize o VinculoManager para associar o tutor ao pet recém-criado.

5. Validação de UI: Verifique se as notificações do ToastContainer aparecem após as ações de criação ou edição.

6. Testes de Facades: Caso deseje rodar testes unitários específicos para as Facades dentro do container:

```bash
    docker exec -it [NOME_DO_CONTAINER] npm test    
```


Desenvolvido por Gabriel Batista da Silva Nogueira - 2026