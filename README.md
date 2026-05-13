# PandemicWatch

Sistema de vigilância epidemiológica global com monitoramento de liberdades civis e guia de relocação (Flag Theory).

**Stack:** Next.js 16 · TypeScript · Tailwind CSS v4 · Supabase · Anthropic Claude API · Vercel

---

## Pré-requisitos

- Node.js 20.9+
- Conta gratuita no [Supabase](https://supabase.com)
- Conta gratuita no [Vercel](https://vercel.com)
- Chave da [Anthropic API](https://console.anthropic.com)
- Chave da [NewsAPI](https://newsapi.org) (gratuita, 100 req/dia)

---

## 1. Configurar o Supabase (gratuito)

1. Acesse [supabase.com](https://supabase.com) e crie uma conta
2. Clique em **New Project** e preencha nome, senha e região
3. Aguarde o projeto ser criado (~2 minutos)
4. No menu lateral, vá em **SQL Editor** > **New query**
5. Cole o conteúdo de `supabase/migrations/001_initial.sql` e clique em **Run**
6. No menu **Project Settings > API**, copie:
   - `Project URL` -> `NEXT_PUBLIC_SUPABASE_URL`
   - `anon public` key -> `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `service_role` key -> `SUPABASE_SERVICE_ROLE_KEY`

---

## 2. Obter chave da Anthropic (Claude API)

1. Acesse [console.anthropic.com](https://console.anthropic.com)
2. Faça login ou crie uma conta
3. Vá em **API Keys** > **Create Key**
4. Copie a chave -> `ANTHROPIC_API_KEY`

Novos usuários recebem créditos gratuitos. O modelo usado é `claude-sonnet-4-20250514`.

---

## 3. Obter chave da NewsAPI (gratuito)

1. Acesse [newsapi.org](https://newsapi.org)
2. Clique em **Get API Key** (plano gratuito: 100 req/dia)
3. Copie a chave -> `NEWSAPI_KEY`

---

## 4. Configurar variáveis de ambiente locais

```bash
cp .env.local.example .env.local
```

Edite `.env.local` com suas chaves reais.

---

## 5. Rodar localmente

```bash
npm install
npm run dev
```

Acesse http://localhost:3000

---

## 6. Deploy no Vercel (gratuito)

### Via CLI:

```bash
npm i -g vercel
vercel login
vercel
```

### Via GitHub:

1. Faça push do projeto para um repositório GitHub
2. Acesse [vercel.com](https://vercel.com) > **New Project**
3. Importe o repositório
4. Em **Environment Variables**, adicione todas as variáveis do `.env.local`
5. Clique em **Deploy**

### Cron jobs (automático via vercel.json):

O `vercel.json` já tem os cron jobs configurados. Para protegê-los, gere um secret:

```bash
# Gerar CRON_SECRET
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

Adicione como `CRON_SECRET` nas env vars do Vercel.

---

## 7. Popular dados iniciais

Após o deploy, execute os crons manualmente:

```bash
curl https://seu-app.vercel.app/api/cron?type=outbreaks&secret=SEU_CRON_SECRET
curl https://seu-app.vercel.app/api/cron?type=news&secret=SEU_CRON_SECRET
curl https://seu-app.vercel.app/api/cron?type=freedom&secret=SEU_CRON_SECRET
```

Os dados de `freedom_scores` e surtos de exemplo já são inseridos pela migration SQL.

---

## Estrutura do Projeto

```
pandemicwatch/
├── app/
│   ├── layout.tsx              # Layout principal + navegacao
│   ├── page.tsx                # Dashboard com mapa mundial
│   ├── manifest.ts             # PWA manifest
│   ├── (dashboard)/
│   │   ├── outbreaks/          # Surtos ativos no mundo
│   │   ├── freedom-index/      # Ranking de liberdade por pais
│   │   ├── flag-theory/        # Guia das 5 bandeiras
│   │   ├── relocation/         # Wizard de relocacao + LLM
│   │   └── legislation/        # Monitoramento legislativo
│   └── api/
│       ├── outbreaks/          # GET surtos
│       ├── news/               # GET noticias
│       ├── ai-summary/         # POST analises Claude
│       ├── legislation/        # GET legislacao
│       └── cron/               # Cron jobs de atualizacao
├── components/
│   ├── WorldMap.tsx            # Mapa interativo (react-simple-maps)
│   ├── OutbreakCard.tsx        # Card de surto
│   ├── NewsCard.tsx            # Card de noticia
│   ├── FreedomScore.tsx        # Card de score de liberdade
│   ├── LegislationTracker.tsx  # Card de mudanca legislativa
│   ├── RelocationGuide.tsx     # Wizard + guia de relocacao
│   └── AIInsights.tsx          # Analises geradas por Claude
├── lib/
│   ├── supabase.ts             # Cliente + queries Supabase
│   ├── claude.ts               # Funcoes Claude API
│   ├── news-fetcher.ts         # RSS + NewsAPI
│   └── freedom-scorer.ts       # Dados base + algoritmo de score
├── hooks/
│   ├── useOutbreaks.ts         # Hook com Realtime
│   ├── useNews.ts              # Hook com Realtime
│   └── useLegislation.ts       # Hook com Realtime
├── types/index.ts              # Todos os tipos TypeScript
├── supabase/migrations/        # Schema SQL completo
├── public/sw.js                # Service Worker PWA
└── vercel.json                 # Cron jobs config
```

---

## Fontes de Dados

| Fonte                    | Tipo             | Frequencia |
|--------------------------|------------------|------------|
| WHO Disease Outbreak News | RSS gratis       | 2x/dia     |
| ProMED Mail              | RSS gratis       | 2x/dia     |
| ECDC Europa              | RSS gratis       | 2x/dia     |
| CDC USA                  | RSS gratis       | 2x/dia     |
| HealthMap                | RSS gratis       | 2x/dia     |
| NewsAPI                  | API (100/dia gratis) | 2x/dia |

---

## Custo Total

| Servico      | Plano                          | Custo       |
|--------------|--------------------------------|-------------|
| Supabase     | Free (500MB, 50k req/mes)      | $0          |
| Vercel       | Hobby (unlimited deploys)      | $0          |
| Anthropic    | Pay-as-you-go (~$0.01/analise) | ~$1-5/mes   |
| NewsAPI      | Free (100 req/dia)             | $0          |
| **Total**    |                                | **~$1-5/mes** |

---

## PWA: Instalar no Celular

1. Abra o app no Chrome (Android) ou Safari (iOS)
2. Toque em Compartilhar > Adicionar a tela inicial
3. O app funciona offline com os ultimos dados em cache
