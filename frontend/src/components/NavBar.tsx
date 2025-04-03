import { MonetizationOn } from '@mui/icons-material';
import { AppBar, Box, Button, Toolbar, Typography } from '@mui/material'
import { useLocation, useNavigate } from 'react-router-dom'

const navItems = [
    { name: 'Accounts', path: '/' },
    { name: 'Transactions', path: '/transactions' },
];

export default function NavBar() {
    const navigate = useNavigate();
    // Match the current route
    const location = useLocation();
    return (
        <AppBar position="fixed" >
            <AppBar component="nav">
                <Toolbar>
                    <MonetizationOn />
                    &nbsp;
                    <Typography
                        variant="h6"
                        component="div"
                        sx={{ flexGrow: 1, display: { xs: 'none', sm: 'block' } }}
                    >
                        Demo Bank
                    </Typography>
                    <Box sx={{ display: { xs: 'none', sm: 'block' } }}>
                        {navItems.map((item) => (
                            <Button key={item.name} sx={{ color: '#fff', opacity: location?.pathname === item.path ? 1 : 0.5 }} onClick={() => navigate(item.path)}>
                                {item.name}
                            </Button>
                        ))}
                    </Box>
                </Toolbar>
            </AppBar>

        </AppBar>
    )
}
