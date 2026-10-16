import { createTheme, ThemeOptions } from '@mui/material/styles'
import type {} from '@mui/x-date-pickers/themeAugmentation'
import { lightPalette } from '@/theme/lightTheme'

export const createAppTheme = () => {
  const palette = lightPalette
  const { layout } = palette
  const fontFamily = [
    'Inter',
    'system-ui',
    '-apple-system',
    'BlinkMacSystemFont',
    '"Segoe UI"',
    'Roboto',
    'sans-serif',
  ].join(',')

  const themeOptions: ThemeOptions = {
    palette,
    typography: {
      fontFamily,
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
            fontFamily,
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
      MuiOutlinedInput: {
        styleOverrides: {
          root: {
            borderRadius: 8,
            fontFamily,
            fontSize: '1rem',
            lineHeight: '1.4375em',
            '&:not(.MuiInputBase-multiline)': {
              height: '50px',
            },
          },
          input: {
            fontFamily,
            fontSize: '1rem',
            lineHeight: '1.4375em',
            '&:not(textarea)': {
              padding: '13px 14px',
              boxSizing: 'border-box',
            },
            '&.MuiInputBase-inputSizeSmall:not(textarea)': {
              padding: '14px 14px',
              boxSizing: 'border-box',
            },
          },
        },
      },
      MuiInputLabel: {
        styleOverrides: {
          outlined: {
            fontFamily,
            fontSize: '1rem',
            '&:not(.MuiInputLabel-shrink)': {
              transform: 'translate(14px, 13px) scale(1)',
            },
            '&.MuiInputLabel-sizeSmall:not(.MuiInputLabel-shrink)': {
              transform: 'translate(14px, 15px) scale(1)',
            },
            '&.MuiInputLabel-shrink': {
              transform: 'translate(14px, -9px) scale(0.75)',
            },
          },
        },
      },
      MuiTextField: {
        styleOverrides: {
          root: {
            '& .MuiOutlinedInput-root': {
              borderRadius: 8,
              fontFamily,
              fontSize: '1rem',
              lineHeight: '1.4375em',
            },
            '& .MuiOutlinedInput-root:not(.MuiInputBase-multiline)': {
              height: '50px',
            },
            '& .MuiOutlinedInput-input:not(textarea)': {
              fontFamily,
              fontSize: '1rem',
              lineHeight: '1.4375em',
              padding: '13px 14px',
              boxSizing: 'border-box',
            },
            '& .MuiOutlinedInput-inputSizeSmall:not(textarea)': {
              fontFamily,
              fontSize: '1rem',
              lineHeight: '1.4375em',
              padding: '14px 14px',
              boxSizing: 'border-box',
            },
            '& .MuiInputLabel-outlined:not(.MuiInputLabel-shrink)': {
              transform: 'translate(14px, 13px) scale(1)',
              fontFamily,
              fontSize: '1rem',
            },
            '& .MuiInputLabel-sizeSmall:not(.MuiInputLabel-shrink)': {
              transform: 'translate(14px, 15px) scale(1)',
              fontFamily,
              fontSize: '1rem',
            },
            '& .MuiInputLabel-outlined.MuiInputLabel-shrink': {
              transform: 'translate(14px, -9px) scale(0.75)',
              fontFamily,
              fontSize: '1rem',
            },
          },
        },
      },
      MuiPickersOutlinedInput: {
        styleOverrides: {
          root: {
            borderRadius: 8,
            boxSizing: 'border-box',
            fontFamily,
            fontSize: '1rem',
            lineHeight: '1.4375em',
            '&:not(.MuiPickersInputBase-multiline)': {
              height: '50px',
            },
          },
          notchedOutline: {
            borderRadius: 8,
          },
          sectionsContainer: {
            fontFamily,
            fontSize: '1rem',
            lineHeight: '1.4375em',
            boxSizing: 'border-box',
          },
        },
      },
      MuiPickersInputBase: {
        styleOverrides: {
          root: {
            borderRadius: 8,
            fontFamily,
            fontSize: '1rem',
            lineHeight: '1.4375em',
          },
          sectionsContainer: {
            fontFamily,
            fontSize: '1rem',
            lineHeight: '1.4375em',
          },
          sectionContent: {
            fontFamily,
            fontSize: '1rem',
            lineHeight: '1.4375em',
            letterSpacing: 'inherit',
          },
        },
      },
      MuiPickersSectionList: {
        styleOverrides: {
          root: {
            fontFamily,
            fontSize: '1rem',
            lineHeight: '1.4375em',
          },
          section: {
            fontFamily,
            fontSize: '1rem',
            lineHeight: '1.4375em',
          },
          sectionContent: {
            fontFamily,
            fontSize: '1rem',
            lineHeight: '1.4375em',
            letterSpacing: 'inherit',
          },
        },
      },
      MuiPickersTextField: {
        styleOverrides: {
          root: {
            '& .MuiPickersOutlinedInput-root': {
              borderRadius: 8,
              boxSizing: 'border-box',
              fontFamily,
              fontSize: '1rem',
              lineHeight: '1.4375em',
              '&:not(.MuiPickersInputBase-multiline)': {
                height: '50px',
              },
            },
            '& .MuiPickersOutlinedInput-notchedOutline': {
              borderRadius: 8,
            },
            '& .MuiPickersInputBase-sectionsContainer': {
              fontFamily,
              fontSize: '1rem',
              lineHeight: '1.4375em',
            },
            '& .MuiPickersSectionList-section': {
              fontFamily,
              fontSize: '1rem',
              lineHeight: '1.4375em',
            },
            '& .MuiPickersSectionList-sectionContent': {
              fontFamily,
              fontSize: '1rem',
              lineHeight: '1.4375em',
            },
            '& .MuiPickersInputBase-sectionSeparator': {
              fontFamily,
              fontSize: '1rem',
              lineHeight: '1.4375em',
            },
            '& .MuiInputLabel-outlined:not(.MuiInputLabel-shrink)': {
              transform: 'translate(14px, 13px) scale(1)',
              fontFamily,
              fontSize: '1rem',
            },
            '& .MuiInputLabel-sizeSmall:not(.MuiInputLabel-shrink)': {
              transform: 'translate(14px, 15px) scale(1)',
              fontFamily,
              fontSize: '1rem',
            },
            '& .MuiInputLabel-outlined.MuiInputLabel-shrink': {
              transform: 'translate(14px, -9px) scale(0.75)',
              fontFamily,
              fontSize: '1rem',
            },
            '& .MuiInputAdornment-root': {
              maxHeight: 'none',
              alignItems: 'center',
              marginRight: -4,
            },
            '& .MuiInputAdornment-root .MuiIconButton-root': {
              padding: 8,
              color: palette.text?.secondary || '#64748B',
            },
          },
        },
      },
    },
  }

  return createTheme(themeOptions)
}

export const appTheme = createAppTheme()
