// src/App.tsx
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { AppBar, Toolbar, Button } from '@mui/material';
import { Accounts } from './pages/Accounts';
import { Transactions } from './pages/Transactions';

function App() {
  return (
    <Router>
      <AppBar position="static">
        <Toolbar>
          <Button color="inherit" component={Link} to="/">Accounts</Button>
          <Button color="inherit" component={Link} to="/transactions">Transactions</Button>
        </Toolbar>
      </AppBar>
      <Routes>
        <Route path="/" element={<Accounts />} />
        <Route path="/transactions" element={<Transactions />} />
      </Routes>
    </Router>
  );
}

export default App;
