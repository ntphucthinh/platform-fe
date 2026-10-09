import { PaletteOptions } from '@mui/material/styles'

declare module '@mui/material/styles' {
  interface Palette {
    layout: {
      header: string
      headerGradient: string
      sidebar: string
      headerText: string
      sidebarText: string
      sidebarActiveBg: string
      sidebarActiveText: string
    }
  }
  interface PaletteOptions {
    layout?: {
      header?: string
      headerGradient?: string
      sidebar?: string
      headerText?: string
      sidebarText?: string
      sidebarActiveBg?: string
      sidebarActiveText?: string
    }
  }
}

export const lightPalette: PaletteOptions = {
  mode: 'light',
  primary: {
    main: '#1976D2',
    light: '#58AAF8',
    dark: '#1565C0',
    contrastText: '#ffffff',
  },
  secondary: {
    main: '#2589F2',
    light: '#4B91F7',
    dark: '#1976D2',
    contrastText: '#ffffff',
  },
  success: {
    main: '#10B981',
    light: '#34D399',
    dark: '#059669',
    contrastText: '#ffffff',
  },
  background: {
    default: '#F7F9FC',
    paper: '#FFFFFF',
  },
  text: {
    primary: '#172033',
    secondary: '#64748B',
    disabled: '#94A3B8',
  },
  divider: '#E7ECF2',
  action: {
    hover: '#F1F5F9',
    selected: '#E5F0FD',
  },
  layout: {
    header: '#58AAF8',
    headerGradient: 'linear-gradient(90deg, #58AAF8 0%, #2589F2 100%)',
    sidebar: '#FFFFFF',
    headerText: '#FFFFFF',
    sidebarText: '#64748B',
    sidebarActiveBg: '#E5F0FD',
    sidebarActiveText: '#1976D2',
  },
}
