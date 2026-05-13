declare module 'react-simple-maps' {
  import { ComponentType, ReactNode, SVGProps, MouseEvent } from 'react'

  export interface ComposableMapProps {
    projection?: string
    projectionConfig?: Record<string, unknown>
    width?: number
    height?: number
    className?: string
    style?: React.CSSProperties
    children?: ReactNode
  }

  export interface ZoomableGroupProps {
    zoom?: number
    minZoom?: number
    maxZoom?: number
    center?: [number, number]
    children?: ReactNode
  }

  export interface GeographiesProps {
    geography: string | object
    children: (props: { geographies: Geography[] }) => ReactNode
  }

  export interface Geography {
    rsmKey: string
    id: string
    properties: Record<string, unknown>
    geometry: object
  }

  export interface GeographyProps extends SVGProps<SVGPathElement> {
    geography: Geography
    style?: {
      default?: React.CSSProperties
      hover?: React.CSSProperties
      pressed?: React.CSSProperties
    }
    onMouseEnter?: (event: MouseEvent<SVGPathElement>) => void
    onMouseLeave?: (event: MouseEvent<SVGPathElement>) => void
    onClick?: (event: MouseEvent<SVGPathElement>) => void
  }

  export const ComposableMap: ComponentType<ComposableMapProps>
  export const ZoomableGroup: ComponentType<ZoomableGroupProps>
  export const Geographies: ComponentType<GeographiesProps>
  export const Geography: ComponentType<GeographyProps>
  export const Marker: ComponentType<Record<string, unknown>>
  export const Line: ComponentType<Record<string, unknown>>
  export const Annotation: ComponentType<Record<string, unknown>>
  export const Sphere: ComponentType<Record<string, unknown>>
  export const Graticule: ComponentType<Record<string, unknown>>
}
