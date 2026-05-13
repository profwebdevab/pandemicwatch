'use client'
import { ComposableMap, Geographies, Geography, ZoomableGroup } from 'react-simple-maps'
import { useState } from 'react'
import type { FreedomScore, Outbreak } from '@/types'

const GEO_URL = 'https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json'

const COUNTRY_ISO_MAP: Record<string, string> = {
  '840': 'US', '076': 'BR', '036': 'AU', '124': 'CA', '554': 'NZ',
  '040': 'AT', '620': 'PT', '276': 'DE', '250': 'FR', '826': 'GB',
  '484': 'MX', '600': 'PY', '591': 'PA', '784': 'AE', '268': 'GE',
  '764': 'TH', '233': 'EE', '702': 'SG', '170': 'CO', '218': 'EC',
  '858': 'UY', '340': 'HN', '682': 'SA', '756': 'CH', '710': 'ZA',
  '356': 'IN', '156': 'CN', '392': 'JP', '410': 'KR', '643': 'RU',
  '566': 'NG', '818': 'EG', '780': 'TT', '894': 'ZM', '180': 'CD',
  '760': 'SY', '050': 'BD', '586': 'PK', '704': 'VN', '360': 'ID',
}

interface Props {
  freedomScores: FreedomScore[]
  outbreaks: Outbreak[]
  onCountryClick?: (countryCode: string) => void
}

function getCountryColor(
  countryCode: string,
  freedomScores: FreedomScore[],
  outbreaks: Outbreak[]
): string {
  const activeOutbreak = outbreaks.find(
    (o) => o.country_code === countryCode && (o.status === 'epidemic' || o.status === 'pandemic')
  )
  if (activeOutbreak) {
    return activeOutbreak.status === 'pandemic' ? '#ff1f1f' : '#ff6b35'
  }

  const monitorOutbreak = outbreaks.find(
    (o) => o.country_code === countryCode && o.status === 'outbreak'
  )
  if (monitorOutbreak) return '#ffb347'

  const fs = freedomScores.find((f) => f.country_code === countryCode)
  if (!fs) return '#1f2937'

  if (fs.overall_score >= 7.5) return '#00ff87'
  if (fs.overall_score >= 6.0) return '#00cc6a'
  if (fs.overall_score >= 4.5) return '#ffb347'
  return '#ff6b35'
}

export default function WorldMap({ freedomScores, outbreaks, onCountryClick }: Props) {
  const [tooltip, setTooltip] = useState<{ name: string; x: number; y: number } | null>(null)

  return (
    <div className="relative w-full bg-[#0d1117] rounded-lg border border-[#00ff87]/20 overflow-hidden" style={{ height: 420 }}>
      <ComposableMap
        projection="geoMercator"
        projectionConfig={{ scale: 130, center: [15, 10] }}
        width={800}
        height={420}
        style={{ width: '100%', height: '100%' }}
      >
        <ZoomableGroup zoom={1} minZoom={0.5} maxZoom={6}>
          <Geographies geography={GEO_URL}>
            {({ geographies }) =>
              geographies.map((geo) => {
                const numericId = geo.id as string
                const countryCode = COUNTRY_ISO_MAP[numericId] || ''
                const color = getCountryColor(countryCode, freedomScores, outbreaks)

                return (
                  <Geography
                    key={geo.rsmKey}
                    geography={geo}
                    fill={color}
                    stroke="#0a0a0f"
                    strokeWidth={0.5}
                    style={{
                      default: { outline: 'none', cursor: 'pointer' },
                      hover: { fill: '#00ff87', outline: 'none', filter: 'brightness(1.3)' },
                      pressed: { outline: 'none' },
                    }}
                    onMouseEnter={(e) => {
                      const props = geo.properties as { name?: string }
                      setTooltip({ name: props.name || countryCode, x: e.clientX, y: e.clientY })
                    }}
                    onMouseLeave={() => setTooltip(null)}
                    onClick={() => countryCode && onCountryClick?.(countryCode)}
                  />
                )
              })
            }
          </Geographies>
        </ZoomableGroup>
      </ComposableMap>

      {tooltip && (
        <div
          className="fixed z-50 bg-[#0a0a0f] border border-[#00ff87]/30 text-[#00ff87] text-xs px-2 py-1 rounded pointer-events-none font-mono"
          style={{ left: tooltip.x + 10, top: tooltip.y - 30 }}
        >
          {tooltip.name}
        </div>
      )}

      {/* Legend */}
      <div className="absolute bottom-2 left-2 flex flex-col gap-1 bg-[#0a0a0f]/80 p-2 rounded border border-[#00ff87]/20">
        {[
          { color: '#00ff87', label: 'Alta Liberdade' },
          { color: '#ffb347', label: 'Liberdade Moderada' },
          { color: '#ff6b35', label: 'Baixa Liberdade / Surto' },
          { color: '#ff1f1f', label: 'Epidemia/Pandemia' },
          { color: '#1f2937', label: 'Sem Dados' },
        ].map(({ color, label }) => (
          <div key={label} className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: color }} />
            <span className="text-[10px] text-gray-400 font-mono">{label}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
