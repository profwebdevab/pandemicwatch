import type { FreedomScore, CountryData } from '@/types'

// Base freedom data — updated via AI scoring
export const BASE_FREEDOM_DATA: Partial<FreedomScore>[] = [
  {
    country_code: 'GE', country_name: 'Georgia', overall_score: 8.5,
    pandemic_response_score: 8.0, lockdown_severity: 2, vaccine_mandate_level: 'none',
    economic_freedom: 8.2, personal_freedom: 7.8, press_freedom: 6.5,
    flag_theory_suitability: 'excellent', flag_theory_tags: ['residency', 'banking', 'lifestyle'],
    cost_of_living_usd: 800, digital_nomad_visa: false,
  },
  {
    country_code: 'PY', country_name: 'Paraguay', overall_score: 7.8,
    pandemic_response_score: 7.5, lockdown_severity: 2, vaccine_mandate_level: 'none',
    economic_freedom: 7.5, personal_freedom: 7.2, press_freedom: 6.0,
    flag_theory_suitability: 'excellent', flag_theory_tags: ['residency', 'banking', 'business'],
    cost_of_living_usd: 700, digital_nomad_visa: false,
  },
  {
    country_code: 'PA', country_name: 'Panama', overall_score: 7.5,
    pandemic_response_score: 6.5, lockdown_severity: 3, vaccine_mandate_level: 'soft',
    economic_freedom: 7.8, personal_freedom: 7.0, press_freedom: 6.8,
    flag_theory_suitability: 'good', flag_theory_tags: ['residency', 'banking', 'business'],
    cost_of_living_usd: 1500, digital_nomad_visa: false,
  },
  {
    country_code: 'AE', country_name: 'UAE', overall_score: 7.2,
    pandemic_response_score: 5.5, lockdown_severity: 3, vaccine_mandate_level: 'hard',
    economic_freedom: 8.5, personal_freedom: 6.0, press_freedom: 4.5,
    flag_theory_suitability: 'good', flag_theory_tags: ['banking', 'business', 'passport'],
    cost_of_living_usd: 3500, digital_nomad_visa: true,
  },
  {
    country_code: 'PT', country_name: 'Portugal', overall_score: 6.8,
    pandemic_response_score: 5.0, lockdown_severity: 4, vaccine_mandate_level: 'soft',
    economic_freedom: 7.0, personal_freedom: 7.5, press_freedom: 7.5,
    flag_theory_suitability: 'good', flag_theory_tags: ['residency', 'passport', 'lifestyle'],
    cost_of_living_usd: 2000, digital_nomad_visa: true,
  },
  {
    country_code: 'MX', country_name: 'Mexico', overall_score: 7.0,
    pandemic_response_score: 7.0, lockdown_severity: 2, vaccine_mandate_level: 'none',
    economic_freedom: 6.8, personal_freedom: 7.0, press_freedom: 5.5,
    flag_theory_suitability: 'good', flag_theory_tags: ['residency', 'lifestyle'],
    cost_of_living_usd: 1000, digital_nomad_visa: false,
  },
  {
    country_code: 'TH', country_name: 'Thailand', overall_score: 6.5,
    pandemic_response_score: 6.0, lockdown_severity: 3, vaccine_mandate_level: 'soft',
    economic_freedom: 7.0, personal_freedom: 6.5, press_freedom: 5.0,
    flag_theory_suitability: 'good', flag_theory_tags: ['lifestyle', 'residency'],
    cost_of_living_usd: 1200, digital_nomad_visa: true,
  },
  {
    country_code: 'EE', country_name: 'Estonia', overall_score: 7.5,
    pandemic_response_score: 6.5, lockdown_severity: 3, vaccine_mandate_level: 'soft',
    economic_freedom: 7.8, personal_freedom: 8.0, press_freedom: 8.5,
    flag_theory_suitability: 'good', flag_theory_tags: ['business', 'residency'],
    cost_of_living_usd: 2000, digital_nomad_visa: true,
  },
  {
    country_code: 'SG', country_name: 'Singapore', overall_score: 6.8,
    pandemic_response_score: 5.5, lockdown_severity: 4, vaccine_mandate_level: 'hard',
    economic_freedom: 9.0, personal_freedom: 6.0, press_freedom: 4.5,
    flag_theory_suitability: 'good', flag_theory_tags: ['banking', 'business'],
    cost_of_living_usd: 4000, digital_nomad_visa: false,
  },
  {
    country_code: 'HN', country_name: 'Honduras', overall_score: 7.2,
    pandemic_response_score: 7.8, lockdown_severity: 2, vaccine_mandate_level: 'none',
    economic_freedom: 6.5, personal_freedom: 6.8, press_freedom: 5.5,
    flag_theory_suitability: 'good', flag_theory_tags: ['residency', 'lifestyle'],
    cost_of_living_usd: 600, digital_nomad_visa: false,
  },
  {
    country_code: 'AU', country_name: 'Australia', overall_score: 4.5,
    pandemic_response_score: 2.0, lockdown_severity: 5, vaccine_mandate_level: 'forced',
    economic_freedom: 7.5, personal_freedom: 5.5, press_freedom: 6.0,
    flag_theory_suitability: 'poor', flag_theory_tags: [],
    cost_of_living_usd: 4500, digital_nomad_visa: false,
  },
  {
    country_code: 'CA', country_name: 'Canada', overall_score: 4.8,
    pandemic_response_score: 3.0, lockdown_severity: 5, vaccine_mandate_level: 'forced',
    economic_freedom: 7.2, personal_freedom: 6.0, press_freedom: 7.5,
    flag_theory_suitability: 'poor', flag_theory_tags: [],
    cost_of_living_usd: 3500, digital_nomad_visa: false,
  },
  {
    country_code: 'AT', country_name: 'Austria', overall_score: 4.2,
    pandemic_response_score: 2.5, lockdown_severity: 5, vaccine_mandate_level: 'forced',
    economic_freedom: 7.0, personal_freedom: 5.5, press_freedom: 7.0,
    flag_theory_suitability: 'poor', flag_theory_tags: [],
    cost_of_living_usd: 3000, digital_nomad_visa: false,
  },
  {
    country_code: 'US', country_name: 'United States', overall_score: 6.2,
    pandemic_response_score: 5.5, lockdown_severity: 3, vaccine_mandate_level: 'soft',
    economic_freedom: 8.0, personal_freedom: 7.0, press_freedom: 6.5,
    flag_theory_suitability: 'fair', flag_theory_tags: ['business'],
    cost_of_living_usd: 4000, digital_nomad_visa: false,
  },
  {
    country_code: 'BR', country_name: 'Brazil', overall_score: 5.8,
    pandemic_response_score: 6.0, lockdown_severity: 3, vaccine_mandate_level: 'soft',
    economic_freedom: 5.5, personal_freedom: 6.5, press_freedom: 6.0,
    flag_theory_suitability: 'fair', flag_theory_tags: ['lifestyle'],
    cost_of_living_usd: 800, digital_nomad_visa: false,
  },
  {
    country_code: 'NZ', country_name: 'New Zealand', overall_score: 3.8,
    pandemic_response_score: 1.5, lockdown_severity: 5, vaccine_mandate_level: 'forced',
    economic_freedom: 7.5, personal_freedom: 5.0, press_freedom: 7.0,
    flag_theory_suitability: 'poor', flag_theory_tags: [],
    cost_of_living_usd: 4000, digital_nomad_visa: false,
  },
  {
    country_code: 'CH', country_name: 'Switzerland', overall_score: 6.5,
    pandemic_response_score: 5.5, lockdown_severity: 3, vaccine_mandate_level: 'soft',
    economic_freedom: 8.5, personal_freedom: 7.5, press_freedom: 7.8,
    flag_theory_suitability: 'fair', flag_theory_tags: ['banking'],
    cost_of_living_usd: 6000, digital_nomad_visa: false,
  },
  {
    country_code: 'CO', country_name: 'Colombia', overall_score: 6.8,
    pandemic_response_score: 6.5, lockdown_severity: 3, vaccine_mandate_level: 'none',
    economic_freedom: 6.5, personal_freedom: 6.8, press_freedom: 5.5,
    flag_theory_suitability: 'good', flag_theory_tags: ['residency', 'lifestyle'],
    cost_of_living_usd: 900, digital_nomad_visa: true,
  },
  {
    country_code: 'EC', country_name: 'Ecuador', overall_score: 7.0,
    pandemic_response_score: 7.0, lockdown_severity: 2, vaccine_mandate_level: 'none',
    economic_freedom: 6.5, personal_freedom: 7.0, press_freedom: 6.0,
    flag_theory_suitability: 'good', flag_theory_tags: ['residency', 'lifestyle'],
    cost_of_living_usd: 700, digital_nomad_visa: false,
  },
  {
    country_code: 'UY', country_name: 'Uruguay', overall_score: 7.2,
    pandemic_response_score: 7.0, lockdown_severity: 2, vaccine_mandate_level: 'soft',
    economic_freedom: 7.0, personal_freedom: 8.0, press_freedom: 7.5,
    flag_theory_suitability: 'good', flag_theory_tags: ['residency', 'lifestyle'],
    cost_of_living_usd: 1500, digital_nomad_visa: false,
  },
]

export function calculateFreedomScore(data: CountryData): number {
  let score = 5.0

  // COVID response penalties
  score -= data.covid_lockdown_days > 300 ? 2.5 : data.covid_lockdown_days > 180 ? 1.5 : data.covid_lockdown_days > 60 ? 0.5 : 0
  score -= data.vaccine_mandate ? 1.5 : 0
  score -= data.health_passport ? 1.0 : 0
  score -= data.border_closures > 12 ? 1.0 : data.border_closures > 6 ? 0.5 : 0
  score -= data.economic_shutdown_percent > 50 ? 1.5 : data.economic_shutdown_percent > 25 ? 0.75 : 0
  score -= data.protests_suppressed ? 1.0 : 0

  // Positive factors
  score += (data.press_freedom_score / 10) * 1.5
  score += (data.economic_freedom_score / 10) * 1.5

  return Math.max(0, Math.min(10, parseFloat(score.toFixed(2))))
}

export function getAlertColor(score: FreedomScore | null, outbreakStatus?: string): string {
  if (outbreakStatus === 'pandemic' || outbreakStatus === 'epidemic') return '#ff3b3b'
  if (outbreakStatus === 'outbreak') return '#ff6b35'
  if (!score) return '#374151'

  if (score.overall_score >= 7.5) return '#00ff87'
  if (score.overall_score >= 6.0) return '#ffb347'
  if (score.overall_score >= 4.5) return '#ff6b35'
  return '#ff3b3b'
}
