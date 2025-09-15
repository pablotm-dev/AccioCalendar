# Sistema de Gerenciamento de Calendário e Apontamentos

Frontend em React para gerenciamento de calendário e apontamentos de horas, integrado com API REST.

## 🚀 Características

- **Design moderno** com cores vivas e interface responsiva
- **Autenticação** com credenciais mockadas (admin/admin)
- **CRUD completo** para Clientes, Projetos e Tarefas
- **Dashboard** com estatísticas e visão geral
- **Consulta de apontamentos** com visualização em lista e calendário
- **Filtros avançados** por cliente, projeto, tarefa e período
- **Integração completa** com API REST

## 🛠️ Tecnologias Utilizadas

- **React 18** com Next.js 15
- **TypeScript** para tipagem estática
- **Tailwind CSS** para estilização
- **Shadcn/ui** para componentes
- **React Hook Form** para formulários
- **SWR** para gerenciamento de estado e cache
- **Lucide React** para ícones
- **Date-fns** para manipulação de datas

## 📋 Pré-requisitos

- Node.js 18+ 
- npm ou yarn
- API REST rodando (veja configuração abaixo)

## ⚙️ Configuração da API

O sistema suporta dois ambientes diferentes:

### Desenvolvimento (localhost)
\`\`\`bash
npm run build:dev
\`\`\`
API: `http://localhost:8081`

### Produção (servidor remoto)
\`\`\`bash
npm run build:prod
\`\`\`
API: `http://179.190.40.40:8081/`

## 🚀 Instalação e Execução

### 1. Clone ou baixe o projeto
\`\`\`bash
# Se usando Git
git clone <url-do-repositorio>
cd calendar-management

# Ou baixe o ZIP e extraia
\`\`\`

### 2. Instale as dependências
\`\`\`bash
npm install
\`\`\`

### 3. Configure o ambiente (opcional)
Crie um arquivo `.env.local` se precisar de configurações específicas:
\`\`\`env
NEXT_PUBLIC_API_URL=http://localhost:8081
API_ENV=development
\`\`\`

### 4. Execute o projeto

#### Para desenvolvimento:
\`\`\`bash
# Servidor de desenvolvimento
npm run dev

# Build para desenvolvimento (API localhost)
npm run build:dev
npm start
\`\`\`

#### Para produção:
\`\`\`bash
# Build para produção (API servidor remoto)
npm run build:prod
npm start
\`\`\`

O sistema estará disponível em `http://localhost:3000`

## 🔐 Credenciais de Acesso

- **Usuário:** admin
- **Senha:** admin

## 📊 Estrutura da API

### Endpoints Disponíveis

#### Clientes
- `GET /clientes` - Listar todos os clientes
- `GET /clientes/{id}` - Obter cliente por ID
- `POST /clientes` - Criar novo cliente
- `PUT /clientes/{id}` - Atualizar cliente
- `DELETE /clientes/{id}` - Excluir cliente

#### Projetos
- `GET /projetos` - Listar todos os projetos
- `GET /projetos/cliente/{clienteId}` - Listar projetos por cliente
- `GET /projetos/{id}` - Obter projeto por ID
- `POST /projetos` - Criar novo projeto
- `PUT /projetos/{id}` - Atualizar projeto
- `DELETE /projetos/{id}` - Excluir projeto

#### Tarefas
- `GET /tasks` - Listar todas as tarefas
- `GET /tasks/projeto/{projetoId}` - Listar tarefas por projeto
- `GET /tasks/{id}` - Obter tarefa por ID
- `GET /tasks/tag/{tagTask}` - Obter tarefa por tag
- `POST /tasks` - Criar nova tarefa
- `PUT /tasks/{id}` - Atualizar tarefa
- `DELETE /tasks/{id}` - Excluir tarefa

### Estrutura dos Dados

#### Cliente
\`\`\`json
{
  "id": 1,
  "nomeCliente": "Nome do Cliente"
}
\`\`\`

#### Projeto
\`\`\`json
{
  "id": 1,
  "nomeProjeto": "Nome do Projeto",
  "idCliente": 1
}
\`\`\`

#### Tarefa
\`\`\`json
{
  "id": 1,
  "nomeTask": "Nome da Tarefa",
  "descricaoTask": "Descrição da Tarefa",
  "idProjeto": 1,
  "tagTask": "TAG-001",
  "dataInicio": "2023-01-01T09:00:00",
  "dataFim": "2023-01-01T17:00:00",
  "isAtivo": true
}
\`\`\`

## 📱 Funcionalidades

### 🏠 Dashboard
- Visão geral dos apontamentos recentes
- Estatísticas de clientes, projetos e tarefas
- Acesso rápido às principais funcionalidades

### 👥 Gerenciamento de Clientes
- Listagem com busca e paginação
- Formulário para adicionar/editar
- Confirmação para exclusão
- Validação de campos obrigatórios

### 📋 Gerenciamento de Projetos
- Listagem com filtro por cliente
- Associação automática com clientes
- Formulário responsivo
- Validação de dados

### ✅ Gerenciamento de Tarefas
- Listagem com filtros múltiplos
- Campos de data/hora para apontamentos
- Status ativo/inativo
- Tags personalizadas
- Associação com projetos

### 📅 Consulta de Apontamentos
- Visualização em lista e calendário
- Filtros por cliente, projeto, tarefa e período
- Interface intuitiva para navegação
- Dados em tempo real

## 🎨 Design

- **Cores vivas** e modernas com boa variação
- **Fundo branco** para melhor legibilidade
- **Interface limpa** e profissional
- **Totalmente responsivo** para mobile e desktop
- **Componentes consistentes** em todo o sistema

## 🔧 Scripts Disponíveis

\`\`\`bash
npm run dev          # Servidor de desenvolvimento
npm run build        # Build padrão
npm run build:dev    # Build para desenvolvimento (localhost)
npm run build:prod   # Build para produção (servidor remoto)
npm start            # Executar build
npm run lint         # Verificar código
\`\`\`

## 🐛 Solução de Problemas

### API não conecta
1. Verifique se a API está rodando na porta correta
2. Confirme a URL da API no ambiente escolhido
3. Verifique se não há bloqueios de CORS

### Erro de build
1. Limpe o cache: `rm -rf .next`
2. Reinstale dependências: `rm -rf node_modules && npm install`
3. Verifique a versão do Node.js (18+)

### Problemas de autenticação
- Use as credenciais: admin/admin
- Limpe o localStorage se necessário

## 📞 Suporte

Para problemas ou dúvidas, verifique:
1. Se a API está rodando corretamente
2. Se as dependências foram instaladas
3. Se a versão do Node.js é compatível
4. Os logs do console para erros específicos

---

**Desenvolvido com ❤️ usando React e Next.js**
