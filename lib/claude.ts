import Anthropic from '@anthropic-ai/sdk'
import type { NewsArticle, LegislationAnalysis, RelocationGuide, FreedomScore, CountryData } from '@/types'

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })
const MODEL = 'claude-sonnet-4-20250514'

export async function summarizeOutbreakNews(articles: NewsArticle[]): Promise<string> {
  const content = articles
    .slice(0, 10)
    .map((a) => `Título: ${a.title}\nFonte: ${a.source}\nResumo: ${a.summary || 'N/A'}`)
    .join('\n\n---\n\n')

  const message = await client.messages.create({
    model: MODEL,
    max_tokens: 1024,
    messages: [
      {
        role: 'user',
        content: `Você é um epidemiologista especialista. Resuma em português, de forma clara e acessível, as seguintes notícias sobre surtos infecciosos. Destaque: patógeno, localização, número de casos/óbitos, potencial pandêmico (1-10), e se a situação está sob controle. Seja factual e evite alarmismo desnecessário.\n\n${content}`,
      },
    ],
  })

  return (message.content[0] as { type: string; text: string }).text
}

export async function analyzeLegislation(
  text: string,
  country: string
): Promise<LegislationAnalysis> {
  const message = await client.messages.create({
    model: MODEL,
    max_tokens: 1024,
    messages: [
      {
        role: 'user',
        content: `Analise esta proposta/lei de ${country}. Classifique como 'restrictive' ou 'libertarian' em termos de liberdades individuais. Avalie impacto em: liberdade de movimento (0-10), liberdade médica (0-10), liberdade econômica (0-10), vigilância estatal (0-10 onde 10 = máxima vigilância). Score geral de liberdade de 1-10 onde 10 = máxima liberdade. Escreva um resumo em português de 2-3 frases. Retorne SOMENTE JSON válido no seguinte formato:
{
  "direction": "restrictive" | "libertarian" | "neutral",
  "freedom_score": number,
  "movement_freedom_impact": number,
  "medical_freedom_impact": number,
  "economic_freedom_impact": number,
  "surveillance_level": number,
  "summary": "string"
}

Texto da lei/proposta:
${text}`,
      },
    ],
  })

  const raw = (message.content[0] as { type: string; text: string }).text
  const jsonMatch = raw.match(/\{[\s\S]*\}/)
  if (!jsonMatch) throw new Error('No JSON in Claude response')
  return JSON.parse(jsonMatch[0]) as LegislationAnalysis
}

export async function generateRelocationGuide(
  country: string,
  budget: string
): Promise<Partial<RelocationGuide>> {
  const message = await client.messages.create({
    model: MODEL,
    max_tokens: 2048,
    messages: [
      {
        role: 'user',
        content: `Crie um guia detalhado passo a passo para uma pessoa de orçamento ${budget} se mudar para ${country}. Retorne SOMENTE JSON válido no formato:
{
  "steps": [
    {
      "order": 1,
      "title": "string",
      "description": "string",
      "duration": "string",
      "cost_usd": number,
      "documents": ["string"],
      "tips": ["string"]
    }
  ],
  "visa_process": {
    "type": "string",
    "duration": "string",
    "cost_usd": number,
    "requirements": ["string"],
    "renewal": "string"
  },
  "banking_options": [
    {
      "bank_name": "string",
      "account_type": "string",
      "requirements": ["string"],
      "monthly_fee_usd": number,
      "online_banking": true
    }
  ],
  "healthcare_info": {
    "public_available": true,
    "quality_score": number,
    "monthly_cost_usd_min": number,
    "monthly_cost_usd_max": number,
    "notes": "string"
  },
  "communities": ["url_or_group_name"]
}

Inclua 7 passos cobrindo: pesquisa/decisão, documentação, visto, conta bancária, logística, primeiros 30 dias, regularização fiscal. Foque em aspectos práticos para brasileiros.`,
      },
    ],
  })

  const raw = (message.content[0] as { type: string; text: string }).text
  const jsonMatch = raw.match(/\{[\s\S]*\}/)
  if (!jsonMatch) throw new Error('No JSON in Claude response')
  return JSON.parse(jsonMatch[0])
}

export async function scoreFreedom(countryData: CountryData): Promise<Partial<FreedomScore>> {
  const message = await client.messages.create({
    model: MODEL,
    max_tokens: 1024,
    messages: [
      {
        role: 'user',
        content: `Com base nos dados abaixo sobre ${countryData.country_name} durante a COVID-19 e tendências atuais, calcule um score de liberdade individual de 0-10. Retorne SOMENTE JSON válido:

Dados: ${JSON.stringify(countryData)}

{
  "overall_score": number,
  "pandemic_response_score": number,
  "lockdown_severity": number (1-5),
  "vaccine_mandate_level": "none" | "soft" | "hard" | "forced",
  "travel_restriction_history": "string",
  "economic_freedom": number,
  "personal_freedom": number,
  "press_freedom": number,
  "flag_theory_suitability": "excellent" | "good" | "fair" | "poor",
  "flag_theory_tags": ["residency","banking","business","passport","lifestyle"]
}`,
      },
    ],
  })

  const raw = (message.content[0] as { type: string; text: string }).text
  const jsonMatch = raw.match(/\{[\s\S]*\}/)
  if (!jsonMatch) throw new Error('No JSON in Claude response')
  return JSON.parse(jsonMatch[0])
}

export async function getTopRelocationDestinations(
  answers: Record<string, unknown>
): Promise<{ country_code: string; country_name: string; reason: string; score: number }[]> {
  const message = await client.messages.create({
    model: MODEL,
    max_tokens: 1024,
    messages: [
      {
        role: 'user',
        content: `Com base no perfil abaixo de um brasileiro querendo se mudar, sugira os 3 melhores destinos levando em conta liberdades civis, custo de vida, facilidade de visto e qualidade de vida. Retorne SOMENTE JSON:

Perfil: ${JSON.stringify(answers)}

[
  {
    "country_code": "XX",
    "country_name": "string",
    "reason": "string em português (2-3 frases)",
    "score": number (0-10)
  }
]`,
      },
    ],
  })

  const raw = (message.content[0] as { type: string; text: string }).text
  const jsonMatch = raw.match(/\[[\s\S]*\]/)
  if (!jsonMatch) throw new Error('No JSON array in Claude response')
  return JSON.parse(jsonMatch[0])
}
