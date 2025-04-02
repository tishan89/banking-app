import { AppBar, Box, Button, Divider, Drawer, List, ListItem, ListItemButton, ListItemText, Toolbar, Typography } from '@mui/material'
import { useState } from 'react';
import { useLocation, useMatch, useNavigate } from 'react-router-dom'

const navItems = [
    { name: 'Accounts', path: '/' },
    { name: 'Transactions', path: '/transactions' },
];
const drawerWidth = 240;
export default function NavBar() {
    const [mobileOpen, setMobileOpen] = useState(false);
    const navigate = useNavigate();
    const handleDrawerToggle = () => {
        setMobileOpen((prevState) => !prevState);
    };

    // Match the current route

    const matchHome = useMatch('');
    const location = useLocation();
    const container = window !== undefined ? () => window.document.body : undefined;


    const drawer = (
        <Box onClick={handleDrawerToggle} sx={{ textAlign: 'center' }}>
            <Typography variant="h6" sx={{ my: 2 }}>
                MUI
            </Typography>
            <Divider />
            <List>
                {navItems.map((item) => (
                    <ListItem key={item.name} disablePadding>
                        <ListItemButton sx={{ textAlign: 'center', opacity: matchHome?.pathname === item.path ? 1 : 0.5 }} onClick={() => navigate(item.path)}>
                            <ListItemText primary={item.name} />
                        </ListItemButton>
                    </ListItem>
                ))}
            </List>
        </Box>
    );

    return (
        <AppBar position="fixed" >
            <AppBar component="nav">
                <Toolbar>
                    <Typography
                        variant="h6"
                        component="div"
                        sx={{ flexGrow: 1, display: { xs: 'none', sm: 'block' } }}
                    >
                        Demo Bank
                    </Typography>
                    <Box sx={{ display: { xs: 'none', sm: 'block' } }}>
                        {navItems.map((item) => (
                            <Button key={item.name} sx={{ color: '#fff', opacity: location?.pathname === item.path ? 1 : 0.5  }} onClick={() => navigate(item.path)}>
                                {item.name}
                            </Button>
                        ))}
                    </Box>
                </Toolbar>
            </AppBar>
            <nav>
                <Drawer
                    container={container}
                    variant="temporary"
                    open={mobileOpen}
                    onClose={handleDrawerToggle}
                    ModalProps={{
                        keepMounted: true, // Better open performance on mobile.
                    }}
                    sx={{
                        display: { xs: 'block', sm: 'none' },
                        '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
                    }}
                >
                    {drawer}
                </Drawer>
            </nav>
        </AppBar>
    )
}
