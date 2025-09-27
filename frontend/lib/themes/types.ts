export interface ThemeColors {
  primary: string
  secondary: string
  accent: string
  background: string
  foreground: string
  muted: string
  mutedForeground: string
  card: string
  cardForeground: string
  border: string
  input: string
  ring: string
  destructive: string
  destructiveForeground: string
  warning: string
  warningForeground: string
  success: string
  successForeground: string
}

export interface ThemeTypography {
  fontFamily: string
  headingFont: string
  fontSize: {
    xs: string
    sm: string
    base: string
    lg: string
    xl: string
    "2xl": string
    "3xl": string
    "4xl": string
  }
  fontWeight: {
    normal: string
    medium: string
    semibold: string
    bold: string
  }
}

export interface ThemeSpacing {
  radius: string
  spacing: {
    xs: string
    sm: string
    md: string
    lg: string
    xl: string
    "2xl": string
  }
}

export interface ThemeConfig {
  id: string
  name: string
  description: string
  colors: ThemeColors
  typography: ThemeTypography
  spacing: ThemeSpacing
  isDark: boolean
}

export interface UserThemePreferences {
  userId: string
  selectedThemeId: string
  customizations: {
    colors?: Partial<ThemeColors>
    typography?: Partial<ThemeTypography>
    spacing?: Partial<ThemeSpacing>
  }
  createdAt: Date
  updatedAt: Date
}
