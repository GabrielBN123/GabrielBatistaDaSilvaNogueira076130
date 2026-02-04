# Processo Seletivo - Engenheiro da Computação Sênior

Este repositório contém a aplicação frontend desenvolvida para o processo seletivo da SEPLAG. O sistema foi construído com foco em escalabilidade, tipagem forte e isolamento de ambiente via Docker.

## 📋 Dados da Inscrição
- **Inscrição:** 16319
- **Candidato:** Gabriel Batista
- **Processo Seletivo:** PROCESSO SELETIVO CONJUNTO Nº 001/2026/SEPLAG e demais Órgãos
- **Cargo:** Engenheiro da Computação - Sênior

---

## 🛠️ Tecnologias e Implementações

A aplicação foi construída sobre um stack moderno e robusto, priorizando performance, acessibilidade e arquitetura reativa:

### Core & Arquitetura
* **React 19 + TypeScript:** Última versão estável do React com segurança de tipagem estática para reduzir erros em tempo de desenvolvimento.
* **Vite:** Build tool de próxima geração para desenvolvimento rápido e bundles otimizados.
* **Docker:** Containerização completa da aplicação para garantir isolamento, reprodutibilidade e consistência do ambiente entre desenvolvimento e produção.

### Gerenciamento de Estado & Dados
* **RxJS:** Implementação de arquitetura reativa (Facades) baseada em Observables e Subjects para gerenciamento de estado complexo e fluxos assíncronos.
* **TanStack Query (React Query):** Gerenciamento de estado do servidor, cache, refetching automático e sincronização de dados.
* **Axios:** Cliente HTTP robusto para comunicação com a API, permitindo interceptadores de requisição/resposta e configuração global.

### Interface & Estilização
* **Tailwind CSS:** Framework *utility-first* para estilização ágil, responsiva e consistente.
* **Shadcn/UI + Radix UI:** Conjunto de componentes reutilizáveis construídos sobre primitivos *headless* (Radix) para garantir máxima acessibilidade (A11y) e customização.
* **Lucide React:** Biblioteca de ícones leve e padronizada.
* **React Toastify:** Sistema de notificações (Toasts) para feedback visual imediato das ações do usuário.

### Autenticação & Rotas
* **React Router DOM:** Roteamento declarativo com suporte a `Lazy Loading` (Suspense), rotas protegidas e navegação SPA.
* **jwt-decode:** Decodificação de tokens JWT no frontend para extração de claims (dados do usuário) e verificação de expiração de sessão sem chamadas desnecessárias ao servidor.

---

## 🚀 Como Executar o Sistema

Siga os passos abaixo para configurar e rodar a aplicação localmente:

### 1. Pré-requisitos
Certifique-se de que você possui o **Git** instalado:
- [Download Git](https://git-scm.com/install/windows)

Após a instalação, confirme que o Git está instalado, no seu terminal execute:
```bash
git --version
```

Certifique-se de que você possui o **Docker** instalado:
- [Download Docker Desktop](https://www.docker.com/products/docker-desktop/)

Após a instalação, confirme se o serviço está ativo, no seu terminal execute:
```bash
docker --version

docker ps
```
<small>
Se este comando retornar um erro de "pipe" ou "connection refused", o Docker Desktop ainda não terminou de inicializar.
</small>

### ATENÇÃO: Pare todos os containers que estiverem executando
```bash
docker rm -f $(docker ps -aq)
```

### ATENÇÃO: Remove todos os containers parados, redes não utilizadas e imagens sem uso
```bash
docker system prune -a --volumes -f
```
<small>Remoção de qualquer vetigio para não ocorrer erro durante a inicialização do Docker</small>

### 2. Clonar o Projeto
Clone o repositório no seu ambiente local, em um diretório abra o seu terminal e execute:
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
Abra o seu navegador e acesse o link gerado pelo Docker: 👉 http://localhost:8080

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

    *    Ao acessar a primeira vez o sistema a cada vez que está próximo de encerrar o token, é automaticamente renovado

4. Verificar Saúde: Acesse a rota /health para confirmar se o servidor frontend está respondendo corretamente.

    Fluxo de Operação:

    *    Realize o login para entrar na área protegida (Dashboard).    

    *    Acesse a tela de Pets e cadastre um animal.

    *    Acesse a tela de Tutores e realize o cadastro de um novo tutor.

    *    Utilize o VinculoManager para associar o tutor ao pet recém-criado.

5. Validação de UI: Verifique se as notificações do ToastContainer aparecem após as ações de criação ou edição.

6. Testes de Facades: Caso deseje rodar testes unitários específicos para as Facades dentro do container:

```bash
docker exec -it frontend npm test
```

#### Conforme solicitado:

## Tela inicial - Dashboard
* **HealthCheck** /
<small>
Tela pensada para início da aplicação, informando a quantidade de pets e tutores cadastrados.
Também exibindo o status atual do ambiente.
</small>

## Pets
* **Listagem** /pets 

<small>Lista de Pets com filtro de nome e raça</small>

* **Detalhamento** /pets/:id

<small>Detalhes do Pet, tutores vinculados e exclusão</small>

* **Cadastro** /pets/novo

<small>Cadastro de Pet</small>

* **Edição** /pets/editar/:id

<small>Edição de Pet</small>

## Tutores
* **Listagem** /tutores

<small>Lista de Tutores com filtro por nome</small>

* **Detalhamento** /tutores/:id

<small>Detalhes do Tutor, pets vinculados e exclusão</small>

* **Cadastro** /tutores/:id

<small>Cadastro do tutor</small>

* **Edição** /tutores/:id

<small>Edição do tutor</small>

## Vincular
* **Pet ao Instrutor** /tutores/:id/pet/novo

<small>Exibição do tutor com a listagem de pets para vincular</small>

* **Instrutor ao Pet** /pets/:id/tutor/novo

<small>Exibição do pet com a listagem de tutores para vincular</small>

### Observação sobre o sistema
O sistema possui um layout intuitivo, com base em cards.

O tema padrão **dark**, com adaptabilidade para se adequar ao tema do navegador.
Padrão de cores: O tema "**amber**" foi selecionado para lembrar a um dos pets famosos (**Cachorro caramelo**), a intensidade da cor foi selecionada para ter maior contraste com o Tema padrão (**Dark**)

O sistema foi pensado utilizando de base a api de Pets [text](https://pet-manager-api.geia.vip/).

O sistema possui a possibilidade de gerenciamento de pets como Cadastro, Edição, Exclusão, e Vínculos de pets e tutores.

Tela de listagem de Pets e Tutores foram criadas com layout diferente para não haver confusão no momento da visualização.


Desenvolvido por Gabriel Batista da Silva Nogueira - 2026