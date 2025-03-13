import React, {useContext, useEffect} from 'react'
import { Context } from '../../..';

import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import MenuIcon from '@mui/icons-material/Menu';
import Container from '@mui/material/Container';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import MenuItem from '@mui/material/MenuItem';
import AdbIcon from '@mui/icons-material/Adb';
import HomeIcon from '@mui/icons-material/Home';
import mainUtil from '../../../Utils/mainUtil';
import doctorLocations from '../../../Locations/DoctorLocations';
import adminLocations from '../../../Locations/AdminLocations';
import DoctorButtons from './MainButtons/DoctorButtons'
import AdminButtons from './MainButtons/AdminButtons'
import SuperAdminButtons from './MainButtons/SuperAdminButtons'
import AdminItems from './MainItems/AdminItems';
import SuperAdminItems from './MainItems/SuperAdminItems'
import DoctorItems from './MainItems/DoctorItems';
import generalLocations from '../../../Locations/GeneralLocations';

function AdminHeader() {
    
    const {store} = useContext(Context)
    const handleLogout = async () => {
        await store.logout()
    }

    const [anchorElNav, setAnchorElNav] = React.useState(null);
    const [anchorElUser, setAnchorElUser] = React.useState(null);

    const handleOpenNavMenu = (event) => {
        setAnchorElNav(event.currentTarget);
    };
    const handleOpenUserMenu = (event) => {
        setAnchorElUser(event.currentTarget);
    };

    const handleCloseNavMenu = () => {
        setAnchorElNav(null);
    };

    const handleReturnHome = () => {
        window.location.href = doctorLocations.index
    }

    const handleCloseUserMenu = () => {
        setAnchorElUser(null);
    };

    const handleSettings = () => {
        window.location.href = generalLocations.settings
    }

    const handleProfile = () => {
        window.location.href = generalLocations.profile

    }

    return (
        <AppBar position="static" style={{padding: 0}}>
            <Container maxWidth="xl">
                <Toolbar disableGutters>
                
                <Typography
                    variant="h6"
                    noWrap
                    component="a"
                    sx={{
                        display: { xs: 'none', md: 'flex' },
                        fontFamily: 'monospace',
                        fontWeight: 700,
                        letterSpacing: '.3rem',
                        color: 'inherit',
                        textDecoration: 'none',
                    }}
                >
                    <HomeIcon onClick={handleReturnHome} sx={{ display: { xs: 'none', md: 'flex' }, mr: 1, mb: 0.5, fontSize: 25, cursor: 'pointer' }} />
                    
                </Typography>

                <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
                    <IconButton
                        size="large"
                        aria-label="account of current user"
                        aria-controls="menu-appbar"
                        aria-haspopup="true"
                        onClick={handleOpenNavMenu}
                        color="inherit"
                    >
                        <MenuIcon />
                    </IconButton>
                    <Menu
                        id="menu-appbar"
                        anchorEl={anchorElNav}
                        anchorOrigin={{
                            vertical: 'bottom',
                            horizontal: 'left',
                        }}
                        keepMounted
                        transformOrigin={{
                            vertical: 'top',
                            horizontal: 'left',
                        }}
                        open={Boolean(anchorElNav)}
                        onClose={handleCloseNavMenu}
                        sx={{
                            display: { xs: 'block', md: 'none' },
                        }}
                    >
                        {store.user.accessLevel === 2 ? <DoctorItems /> : (store.user.accessLevel === 3 ? <AdminItems /> : <SuperAdminItems /> )}
                    </Menu>
                </Box>
                
                <Typography
                    variant="h5"
                    noWrap
                    component="a"
                    sx={{
                        display: { xs: 'flex', md: 'none' },
                        flexGrow: 1,
                        fontFamily: 'monospace',
                        fontWeight: 700,
                        letterSpacing: '.3rem',
                        color: 'inherit',
                        textDecoration: 'none',
                    }}
                >
                    <HomeIcon onClick={handleReturnHome} sx={{ display: { xs: 'flex', md: 'none' }, mr: 1, fontSize: 25, cursor: 'pointer' }} />
                    
                </Typography>
                <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
                    {store.user.accessLevel === 2 ? <DoctorButtons /> : (store.user.accessLevel === 3 ? <AdminButtons /> : <SuperAdminButtons /> )}
                </Box>

                <Box sx={{ flexGrow: 0 }}>
                    <Tooltip title="Открыть настройки">
                    <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>

                        <Avatar alt="Remy Sharp" src={store.user.avatar} />
                    </IconButton>
                    </Tooltip>
                    <Menu
                        sx={{ mt: '45px' }}
                        id="menu-appbar"
                        anchorEl={anchorElUser}
                        anchorOrigin={{
                            vertical: 'top',
                            horizontal: 'right',
                        }}
                        keepMounted
                        transformOrigin={{
                            vertical: 'top',
                            horizontal: 'right',
                        }}
                        open={Boolean(anchorElUser)}
                        onClose={handleCloseUserMenu}
                    >
                        {/* <MenuItem onClick={handleProfile}>
                            <Typography textAlign="center">Профиль</Typography>
                        </MenuItem> */}
                        <MenuItem onClick={handleSettings}>
                            <Typography textAlign="center">Настройки</Typography>
                        </MenuItem>
                        <MenuItem onClick={handleLogout}>
                            <Typography textAlign="center">Выйти</Typography>
                        </MenuItem>
                    </Menu>
                </Box>
                </Toolbar>
            </Container>
        </AppBar>
    );
}

export default AdminHeader