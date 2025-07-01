# 🌱 SmartPlant - Sistema Inteligente de Monitoramento de Plantas

![Python](https://img.shields.io/badge/Python-3.8+-blue)
![Node.js](https://img.shields.io/badge/Node.js-18+-green)
![React Native](https://img.shields.io/badge/React%20Native-0.79-blue)
![Next.js](https://img.shields.io/badge/Next.js-15.3-black)

## 🌱 Link para a aplicação -> [clique aqui](https://smart-plant-pi.vercel.app/)

## 📋 Sobre o Projeto

O SmartPlant é um sistema completo de monitoramento inteligente de plantas que integra tecnologias IoT, aplicações web e móveis para fornecer uma solução abrangente de cuidado de plantas. O sistema monitora em tempo real condições ambientais como temperatura e umidade, enviando alertas quando os parâmetros saem dos limites ideais.

### 🎯 Funcionalidades Principais

- **Monitoramento em Tempo Real**: Coleta automática de dados de temperatura e umidade via sensores DHT22
- **Sistema de Alertas**: Notificações automáticas quando a umidade está abaixo do limite configurado
- **Análises Estatísticas**: Estatísticas descritivas completas dos dados coletados
- **Múltiplas Plantas**: Gerenciamento de várias plantas por usuário
- **Histórico Detalhado**: Visualização do histórico completo de dados e alertas
- **Interface Multiplataforma**: Acesso via web e aplicativo móvel

## 🏗️ Arquitetura do Sistema

O projeto está estruturado em quatro componentes principais:

```
📁 SmartPlantPI/
├── 🌐 frontend/          # Aplicação Web (Next.js + React)
├── 🖥️  server/           # API Backend (Node.js + Express + Prisma)
├── 📱 mobile/            # Aplicativo Mobile (React Native + Expo)
├── 🔌 IoT/               # Sensores IoT (Python + Raspberry Pi)
└── 📄 README.md
```

### 🔧 Stack Tecnológica

#### Frontend Web
- **Next.js 15.3** - Framework React com SSR
- **React 19** - Biblioteca de interface
- **Tailwind CSS 4** - Framework CSS utilitário
- **ESLint** - Linting de código

#### Backend API
- **Node.js** - Runtime JavaScript
- **Express 5** - Framework web
- **Prisma** - ORM para banco de dados
- **PostgreSQL** - Banco de dados relacional (Neon DB)
- **JWT** - Autenticação baseada em tokens
- **Swagger** - Documentação da API
- **bcryptjs** - Hash de senhas

#### Mobile
- **React Native 0.79** - Framework mobile multiplataforma
- **Expo 53** - Plataforma de desenvolvimento
- **React Navigation 7** - Navegação entre telas
- **React Native Chart Kit** - Visualização de gráficos
- **AsyncStorage** - Armazenamento local

#### IoT
- **Python 3.8+** - Linguagem de programação
- **Adafruit DHT** - Biblioteca para sensor DHT22
- **psycopg2** - Conector PostgreSQL
- **Raspberry Pi** - Hardware IoT

## 🗄️ Modelo de Dados

O sistema utiliza PostgreSQL com as seguintes entidades principais:

```sql
Usuario
├── id (BigInt, PK)
├── email (String, Unique)
├── senha (String, Hash)
├── nome (String)
└── plantas[] (Relação 1:N)

Planta
├── id (BigInt, PK)
├── usuarioId (BigInt, FK)
├── nome (String)
├── alerta (Relação 1:1)
├── sensordata[] (Relação 1:N)
└── historicoalertas[] (Relação 1:N)

SensorData
├── id (BigInt, PK)
├── plantaId (BigInt, FK)
├── temperatura (Float)
├── umidade (Float)
└── timestamp (DateTime)

Alerta
├── id (BigInt, PK)
├── plantaId (BigInt, FK)
└── minUmidade (Float)
```

## 🚀 Instalação e Configuração

### Pré-requisitos

- **Node.js** 18+ e npm
- **Python** 3.8+
- **PostgreSQL** (ou acesso ao Neon DB)
- **Raspberry Pi** (para componente IoT)
- **Expo CLI** (para mobile)

### 1. Clone o Repositório

```bash
git clone https://github.com/pblcnr/SmartPlantPI.git
cd SmartPlantPI
```

### 2. Configuração do Backend

```bash
cd server
npm install
```

Crie um arquivo `.env` no diretório `server/`:

```env
DATABASE_URL="postgresql://usuario:senha@host:5432/database?sslmode=require"
JWT_SECRET="seu_jwt_secret_super_seguro"
PORT=3001
```

Execute as migrações do banco:

```bash
npx prisma generate
npx prisma db push
```

Inicie o servidor:

```bash
npm run dev    # Desenvolvimento
npm start      # Produção
```

### 3. Configuração do Frontend

```bash
cd frontend
npm install
npm run dev
```

Acesse: `http://localhost:3000`

### 4. Configuração do Mobile

```bash
cd mobile/mobile
npm install
npx expo start
```

Use o Expo Go para testar no dispositivo móvel.

### 5. Configuração do IoT

```bash
cd IoT
pip install adafruit-circuitpython-dht psycopg2-binary
```

Configure as credenciais do banco no arquivo `leitor.py` e execute:

```bash
python leitor.py
```

## 📱 Como Usar

### Registro e Login
1. Acesse a aplicação web ou mobile
2. Crie uma conta fornecendo nome, email e senha
3. Faça login com suas credenciais

### Gerenciamento de Plantas
1. Adicione suas plantas no sistema
2. Configure limites de umidade para alertas
3. Visualize dados em tempo real

### Monitoramento
1. O sensor IoT coleta dados automaticamente a cada 15 minutos
2. Dados são enviados para o banco de dados
3. Alertas são gerados quando umidade < limite configurado

### Análises
1. Acesse estatísticas detalhadas no dashboard
2. Visualize gráficos de tendências
3. Consulte histórico de alertas

## 📊 API Endpoints

A API REST está documentada com Swagger. Principais endpoints:

### Autenticação
- `POST /api/auth/registro` - Cadastro de usuário
- `POST /api/auth/login` - Login de usuário

### Plantas
- `GET /api/plantas` - Listar plantas do usuário
- `POST /api/plantas` - Criar nova planta
- `PUT /api/plantas/:id` - Atualizar planta
- `DELETE /api/plantas/:id` - Remover planta

### Dados do Sensor
- `POST /api/plantas/:id/sensordata` - Registrar dados
- `GET /api/plantas/:id/sensordata` - Histórico de dados

### Alertas
- `POST /api/plantas/:id/alertlimit` - Configurar limite
- `GET /api/plantas/:id/alertas` - Histórico de alertas

**Documentação completa:** `http://localhost:3001/api-docs`

## 🔧 Desenvolvimento

### Scripts Disponíveis

#### Backend
```bash
npm run dev      # Servidor em modo desenvolvimento
npm start        # Servidor em produção
npm run prisma   # Gerar cliente Prisma
```

#### Frontend
```bash
npm run dev      # Desenvolvimento
npm run build    # Build para produção
npm run start    # Servidor de produção
npm run lint     # Verificar código
```

#### Mobile
```bash
npx expo start         # Iniciar desenvolvimento
npx expo start --android  # Android
npx expo start --ios      # iOS
```

### Estrutura de Pastas

```
server/
├── src/
│   ├── controllers/    # Lógica de negócio
│   ├── routes/        # Definição de rotas
│   ├── middlewares/   # Middlewares (auth, etc.)
│   └── server.js      # Entrada da aplicação
├── prisma/
│   └── schema.prisma  # Schema do banco
└── swagger.json       # Documentação API

frontend/
├── src/
│   ├── app/          # Páginas Next.js
│   ├── components/   # Componentes React
│   └── styles/       # Estilos CSS
└── public/           # Arquivos estáticos

mobile/mobile/
├── src/
│   ├── screens/      # Telas da aplicação
│   ├── components/   # Componentes reutilizáveis
│   └── services/     # Serviços de API
└── App.js           # Componente principal
```

## 🌐 Deploy

### Backend (Railway/Heroku)
1. Configure as variáveis de ambiente
2. Faça push para o repositório
3. Configure o banco PostgreSQL

### Frontend (Vercel/Netlify)
1. Conecte o repositório
2. Configure as variáveis de ambiente
3. Deploy automático via Git

### Mobile (Expo)
```bash
npx expo build:android  # Build Android
npx expo build:ios      # Build iOS
```

## 🔒 Segurança

- **Autenticação JWT** com tokens seguros
- **Hash de senhas** com bcryptjs
- **Validação de entrada** em todos os endpoints
- **CORS** configurado adequadamente
- **Variáveis de ambiente** para credenciais sensíveis

## 📈 Monitoramento e Logs

- Logs de operações no console
- Tratamento de erros em todos os componentes
- Reconexão automática do sensor IoT
- Validação de dados antes da inserção

## 🤝 Contribuição

1. Faça fork do projeto
2. Crie uma branch: `git checkout -b feature/nova-funcionalidade`
3. Commit suas mudanças: `git commit -m 'Adiciona nova funcionalidade'`
4. Push para a branch: `git push origin feature/nova-funcionalidade`
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para detalhes.

## 📞 Suporte

Para dúvidas e suporte:
- Abra uma [issue](https://github.com/seu-usuario/DSM-P4-G03-2025-3/issues)
- Entre em contato com a equipe de desenvolvimento

---

**Desenvolvido por Paulo Henrique de Andrade**