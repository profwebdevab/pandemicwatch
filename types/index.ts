export type PathogenType = 'virus' | 'bacteria' | 'fungus' | 'prion'
export type PandemicPotential = 'low' | 'medium' | 'high' | 'critical'
export type OutbreakStatus = 'monitoring' | 'outbreak' | 'epidemic' | 'pandemic'
export type VaccineMandateLevel = 'none' | 'soft' | 'hard' | 'forced'
export type FlagTheorySuitability = 'excellent' | 'good' | 'fair' | 'poor'
export type LegislationDirection = 'restrictive' | 'libertarian' | 'neutral'
export type LegislationCategory = 'health_mandate' | 'travel' | 'surveillance' | 'speech' | 'economic'
export type ImpactLevel = 'low' | 'medium' | 'high' | 'critical'
export type BudgetTier = 'shoestring' | 'budget' | 'mid' | 'comfort'
export type NewsSentiment = 'restrictive' | 'neutral' | 'libertarian'
export type NewsCategory = 'outbreak' | 'legislation' | 'freedom' | 'relocation'

export interface Outbreak {
  id: string
  pathogen_name: string
  pathogen_type: PathogenType
  pandemic_potential: PandemicPotential
  country_code: string
  country_name: string
  region?: string
  suspected_cases: number
  confirmed_cases: number
  deaths: number
  status: OutbreakStatus
  source_url?: string
  source_name?: string
  first_reported_at?: string
  last_updated_at: string
  created_at: string
}

export interface NewsArticle {
  id: string
  title: string
  summary?: string
  ai_summary?: string
  url: string
  source?: string
  language: string
  country_code?: string
  pathogen_mentioned?: string[]
  category?: NewsCategory
  sentiment?: NewsSentiment
  published_at?: string
  fetched_at: string
}

export interface FreedomScore {
  id: string
  country_code: string
  country_name: string
  overall_score: number
  pandemic_response_score: number
  lockdown_severity: number
  vaccine_mandate_level: VaccineMandateLevel
  travel_restriction_history?: string
  economic_freedom: number
  personal_freedom: number
  press_freedom: number
  flag_theory_suitability: FlagTheorySuitability
  flag_theory_tags: string[]
  visa_options?: Record<string, unknown>
  cost_of_living_usd?: number
  digital_nomad_visa: boolean
  updated_at: string
}

export interface LegislationChange {
  id: string
  country_code: string
  country_name: string
  title: string
  description?: string
  ai_analysis?: string
  type: 'proposed' | 'passed' | 'repealed'
  direction: LegislationDirection
  category: LegislationCategory
  impact_level: ImpactLevel
  source_url?: string
  effective_date?: string
  published_at: string
}

export interface RelocationGuide {
  id: string
  country_code: string
  country_name: string
  budget_tier: BudgetTier
  monthly_budget_min_usd: number
  monthly_budget_max_usd: number
  steps: RelocationStep[]
  visa_process?: VisaProcess
  banking_options?: BankingOption[]
  healthcare_info?: HealthcareInfo
  communities?: string[]
  updated_at: string
}

export interface RelocationStep {
  order: number
  title: string
  description: string
  duration: string
  cost_usd?: number
  documents?: string[]
  tips?: string[]
}

export interface VisaProcess {
  type: string
  duration: string
  cost_usd: number
  requirements: string[]
  renewal?: string
}

export interface BankingOption {
  bank_name: string
  account_type: string
  requirements: string[]
  monthly_fee_usd?: number
  online_banking: boolean
}

export interface HealthcareInfo {
  public_available: boolean
  quality_score: number
  monthly_cost_usd_min: number
  monthly_cost_usd_max: number
  notes: string
}

export interface LegislationAnalysis {
  direction: LegislationDirection
  freedom_score: number
  movement_freedom_impact: number
  medical_freedom_impact: number
  economic_freedom_impact: number
  surveillance_level: number
  summary: string
}

export interface CountryData {
  country_code: string
  country_name: string
  covid_lockdown_days: number
  vaccine_mandate: boolean
  health_passport: boolean
  border_closures: number
  economic_shutdown_percent: number
  protests_suppressed: boolean
  press_freedom_score: number
  economic_freedom_score: number
}

export interface MapCountryData {
  country_code: string
  status: 'outbreak' | 'monitoring' | 'free' | 'no-data'
  alert_level: number
  outbreaks_count: number
  freedom_score?: number
}

export interface GlobalStats {
  total_suspected: number
  total_confirmed: number
  total_deaths: number
  active_outbreaks: number
  countries_affected: number
  last_updated: string
}

export interface RelocationWizardAnswers {
  budget: 'under500' | '500-1000' | '1000-2000' | '2000-5000' | 'over5000'
  profession: 'remote_worker' | 'entrepreneur' | 'retired' | 'student' | 'other'
  family_size: '1' | '2' | '3-4' | '5+'
  priorities: string[]
  languages: string[]
  climate: 'tropical' | 'temperate' | 'mediterranean' | 'any'
  region_preference: string[]
}

export interface FlagTheoryFlag {
  category: 'residence' | 'passport' | 'banking' | 'business' | 'lifestyle'
  countries: FlagCountryOption[]
}

export interface FlagCountryOption {
  country_code: string
  country_name: string
  reason: string
  pros: string[]
  cons: string[]
  covid_score: number
  cost_usd: number
  difficulty: 'easy' | 'medium' | 'hard'
}
