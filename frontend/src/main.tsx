import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { createTheme, ThemeProvider } from '@mui/material'

const theme = createTheme({
  palette: {
    // primary: {
    //   main: '#2196F3', // Blue color
    // },
    // secondary: {
    //   main: '#03A9F4', // Light blue
    // },
    // background: {
    //   default: '#E3F2FD', // Light blueish background
    //   paper: '#eee', // Slightly darker blue for paper
    // },
    // text: {
    //   primary: '#0D47A1', // Dark blue for contrast
    //   secondary: '#1976D2', // Medium blue for secondary text
    // },
  },
});

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider theme={theme} >
      <App />
    </ThemeProvider>
  </StrictMode>,
)
