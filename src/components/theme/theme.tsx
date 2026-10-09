import { ReactNode } from 'react'
import { ThemeProvider as MuiThemeProvider, CssBaseline } from '@mui/material'
import { appTheme } from '@/theme/theme'

export function CustomThemeProvider({ children }: { children: ReactNode }) {
  return <MuiThemeProvider theme={appTheme}><CssBaseline />{children}</MuiThemeProvider>
}