import { createTheme, ThemeOptions } from '@mui/material/styles'
import { lightPalette } from '@/theme/lightTheme'

export const createAppTheme = () => {
  const palette = lightPalette
  const { layout } = palette

  const themeOptions: ThemeOptions = {
    palette,
    typography: {
      fontFamily: [
        'Inter',
        'system-ui',
        '-apple-system',
        'BlinkMacSystemFont',
        '"Segoe UI"',
        'Roboto',
        'sans-serif',
      ].join(','),
      h5: {
        fontWeight: 600,
        color: palette.text?.primary,
      },
      h6: {
        fontWeight: 600,
        color: palette.text?.primary,
      },
      subtitle1: {
        fontWeight: 500,
      },
      button: {
        textTransform: 'none',
        fontWeight: 600,
      },
    },
    shape: {
      borderRadius: 8,
    },
    components: {
      MuiCssBaseline: {
        styleOverrides: {
          body: {
            backgroundColor: palette.background?.default,
            color: palette.text?.primary,
            fontFamily: [
              'Inter',
              'system-ui',
              '-apple-system',
              'BlinkMacSystemFont',
              '"Segoe UI"',
              'Roboto',
              'sans-serif',
            ].join(','),
          },
        },
      },
      MuiButton: {
        styleOverrides: {
          root: {
            borderRadius: 8,
            boxShadow: 'none',
            '&:hover': {
              boxShadow: 'none',
            },
          },
        },
      },
      MuiPaper: {
        styleOverrides: {
          root: {
            backgroundImage: 'none',
            backgroundColor: palette.background?.paper,
            color: palette.text?.primary,
          },
          outlined: {
            borderColor: palette.divider,
          },
        },
      },
      MuiCard: {
        styleOverrides: {
          root: {
            backgroundImage: 'none',
            borderRadius: 12,
            backgroundColor: palette.background?.paper,
            color: palette.text?.primary,
            border: 'none',
            boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.05), 0 1px 2px -1px rgba(0, 0, 0, 0.03)',
          },
        },
      },
      MuiAppBar: {
        styleOverrides: {
          root: {
            background: layout?.headerGradient || layout?.header || '#1976D2',
            color: layout?.headerText || '#ffffff',
            borderBottom: 'none',
            boxShadow: 'none',
          },
        },
      },
      MuiDrawer: {
        styleOverrides: {
          paper: {
            backgroundColor: layout?.sidebar || palette.background?.paper,
            color: layout?.sidebarText || palette.text?.secondary,
            borderRight: `1px solid ${palette.divider}`,
          },
        },
      },
      MuiListItemIcon: {
        styleOverrides: {
          root: {
            color: 'inherit',
          },
        },
      },
      MuiTextField: {
        styleOverrides: {
          root: {
            '& .MuiOutlinedInput-root': {
              borderRadius: 8,
            },
          },
        },
      },
    },
  }

  return createTheme(themeOptions)
}

export const appTheme = createAppTheme()
