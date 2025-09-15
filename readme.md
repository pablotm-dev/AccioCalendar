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
- **Proxy interno** para resolver problemas de Mixed Content em HTTPS

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
API: `http://179.190.40.40:8081`

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

### 3. Execute o projeto

#### ⚡ DESENVOLVIMENTO (Recomendado para testes)
\`\`\`bash
npm run dev
\`\`\`
**API usada:** `http://localhost:8081`  
**Acesse:** `http://localhost:3000`

#### 🏗️ PRODUÇÃO (Após desenvolvimento completo)

**Para ambiente de desenvolvimento:**
\`\`\`bash
npm run build:dev
npm start
\`\`\`
**API usada:** `http://localhost:8081`

**Para ambiente de produção:**
\`\`\`bash
npm run build:prod
npm start
\`\`\`
**API usada:** `http://179.190.40.40:8081`

#### 🧪 TESTANDO BUILD DE PRODUÇÃO LOCALMENTE

Para testar se o build de produção está funcionando corretamente:

**1. Teste com API local:**
\`\`\`bash
# Faça o build para desenvolvimento
npm run build:dev

# Execute o servidor de produção
npm start

# Acesse: http://localhost:3000
\`\`\`

**2. Teste com API de produção:**
\`\`\`bash
# Faça o build para produção
npm run build:prod

# Execute o servidor de produção  
npm start

# Acesse: http://localhost:3000
\`\`\`

**3. Verificações importantes:**
- ✅ A aplicação deve carregar sem erros
- ✅ Login deve funcionar (admin/admin)
- ✅ Todas as páginas devem ser acessíveis
- ✅ API deve responder corretamente
- ✅ Não deve haver erros no console do navegador

### ⚠️ IMPORTANTE - Comandos Corretos

- **Para desenvolvimento/testes:** Use `npm run dev` (não precisa de build)
- **Para produção:** Primeiro `npm run build:dev` ou `npm run build:prod`, depois `npm start`
- **NUNCA use** `npm start` sem fazer build antes

## 🔐 Credenciais de Acesso

- **Usuário:** admin
- **Senha:** admin

## 🌐 Deploy na Vercel

### Problema de Mixed Content Resolvido

O sistema inclui um **proxy interno** que resolve automaticamente problemas de Mixed Content quando deployado em HTTPS (como na Vercel) mas conectando a APIs HTTP.

**Como funciona:**
- O cliente (navegador) se comunica apenas via HTTPS com o servidor Next.js
- O servidor Next.js faz as requisições HTTP para a API externa
- Elimina completamente erros de "Mixed Content" em produção

**Configuração automática:**
- Não requer configuração adicional
- Funciona automaticamente em desenvolvimento e produção
- Mantém todas as funcionalidades da API intactas

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

### Erro de Mixed Content (Resolvido)
- ✅ **Problema resolvido automaticamente** pelo proxy interno
- ✅ Funciona em desenvolvimento e produção
- ✅ Não requer configuração adicional
- ✅ Compatível com deploy na Vercel

## 📞 Suporte

Para problemas ou dúvidas, verifique:
1. Se a API está rodando corretamente
2. Se as dependências foram instaladas
3. Se a versão do Node.js é compatível
4. Os logs do console para erros específicos

---

**Desenvolvido com ❤️ usando React e Next.js**
