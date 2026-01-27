export type FontFamily = 'playfair' | 'inter' | 'jetbrains' | 'fraktur'
export type TextAlign = 'left' | 'center' | 'justify' | 'right'
export type TextSize = 'sm' | 'base' | 'lg' | 'xl'
export type Spacing = 'tight' | 'normal' | 'relaxed' | 'loose'

export interface RenderingConfig {
    fontFamily?: FontFamily
    textAlign?: TextAlign
    fontSize?: TextSize
    lineHeight?: Spacing
    letterSpacing?: Spacing
    dropCap?: boolean
    uppercaseHeader?: boolean
    showLineNumbers?: boolean   // For poems
    paragraphSpacing?: Spacing  // For prose
}

export const defaultConfig: RenderingConfig = {
    fontFamily: 'playfair',
    textAlign: 'left',
    fontSize: 'lg',
    lineHeight: 'relaxed',
    letterSpacing: 'normal',
    dropCap: false,
}

export const poemDefaultConfig: RenderingConfig = {
    ...defaultConfig,
    textAlign: 'center',
    lineHeight: 'loose',
}
