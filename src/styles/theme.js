import { DefaultTheme } from 'react-native-paper';

export const theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: '#1E90FF',
    accent: '#03DAC6',
    background: '#F5F5F5',
    surface: '#FFFFFF',
    text: '#000000',
    disabled: '#CCCCCC',
    placeholder: '#666666',
    backdrop: 'rgba(0, 0, 0, 0.5)',
    error: '#B00020',
    success: '#4CAF50',
    warning: '#FF9800',
  },
  fonts: {
    regular: {
      fontFamily: 'Roboto',
      fontWeight: 'normal',
    },
    medium: {
      fontFamily: 'Roboto',
      fontWeight: '500',
    },
    light: {
      fontFamily: 'Roboto',
      fontWeight: '300',
    },
    thin: {
      fontFamily: 'Roboto',
      fontWeight: '100',
    },
  },
};

export const persianTheme = {
  ...theme,
  fonts: {
    regular: {
      fontFamily: 'Vazir',
      fontWeight: 'normal',
    },
    medium: {
      fontFamily: 'Vazir',
      fontWeight: '500',
    },
    light: {
      fontFamily: 'Vazir',
      fontWeight: '300',
    },
    thin: {
      fontFamily: 'Vazir',
      fontWeight: '100',
    },
  },
};