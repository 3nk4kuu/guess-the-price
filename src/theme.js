import { createTheme } from '@mui/material/styles';

export const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: { main: '#67c1f5' },
    success: { main: '#75b022' },
    background: { default: '#172b3a', paper: '#132331' },
    text: { primary: '#d6e5ef', secondary: '#9eb7c9' },
  },
  typography: { fontFamily: '"Source Sans 3", sans-serif' },
  components: { MuiDialog: { styleOverrides: { paper: { backgroundImage: 'none', borderRadius: 6 } } } },
});
