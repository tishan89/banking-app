import { MonetizationOn } from '@mui/icons-material';
import { AppBar, Avatar, Box, Button, Toolbar, Typography } from '@mui/material'
import { useLocation, useNavigate } from 'react-router-dom'
import { IconButton, Menu, MenuItem } from '@mui/material';
import React, { useState } from 'react';
import User, { IUser } from './User';
import { deepOrange } from '@mui/material/colors';
import { getSessionHint } from '../utils/cookie';

const navItems = [
    { name: 'Accounts', path: '/' },
    { name: 'Transactions', path: '/transactions' },
];

interface NavBarProps {
    user: IUser | null
}
export default function NavBar(props: NavBarProps) {
    const { user } = props
    const navigate = useNavigate();
    // Match the current route
    const location = useLocation();
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);

    const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    const handleLogout = () => {
        setAnchorEl(null);
        // Add logout logic here
        window.location.href = '/auth/logout?session_hint=' + getSessionHint();
    };


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
                        {user && navItems.map((item) => (
                            <Button key={item.name} sx={{ color: '#fff', opacity: location?.pathname === item.path ? 1 : 0.5 }} onClick={() => navigate(item.path)}>
                                {item.name}
                            </Button>
                        ))}
                    </Box>
                    {user &&
                        <>
                            <IconButton
                                size="medium"
                                onClick={handleMenuOpen}
                            >
                                <Avatar sx={{ bgcolor: deepOrange[500] }}>{`${user.first_name[0]}${user.last_name[0]}`}</Avatar>
                            </IconButton>

                            <Menu
                                anchorEl={anchorEl}
                                open={open}
                                onClose={handleMenuClose}
                            >
                                <MenuItem>
                                    <User user={user} />
                                </MenuItem>
                                <MenuItem onClick={handleLogout}>Logout</MenuItem>
                            </Menu>
                        </>
                        }
                </Toolbar>
            </AppBar>

        </AppBar>
    )
}
