// src/App.tsx
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Accounts } from './pages/Accounts';
import { Transactions } from './pages/Transactions';
import NavBar from './components/NavBar';
import { Box } from '@mui/material';


function App() {
  return (
    <Router>
      <Box sx={{ display: 'flex', paddingTop: 8, flexDirection: 'column', width:'100vw', height: '100vh' }}>
        <NavBar />
        <Routes>  
          <Route path="/" element={<Accounts />} />
          <Route path="/transactions" element={<Transactions />} />
        </Routes>
      </Box>
    </Router>
  );
}

export default App;
