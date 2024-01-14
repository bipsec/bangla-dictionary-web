import React, { useContext, useState } from 'react';
import { styled } from '@mui/material/styles';
import Drawer from '@mui/material/Drawer';
import CssBaseline from '@mui/material/CssBaseline';
import MuiAppBar, { AppBarProps as MuiAppBarProps } from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import MenuIcon from '@mui/icons-material/Menu';
import { Box, IconButton, useTheme } from '@mui/material';
import LightModeOutlinedIcon from '@mui/icons-material/LightModeOutlined';
import DarkModeOutlinedIcon from '@mui/icons-material/DarkModeOutlined';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import { ColorModeContext } from '../../theme/theme';
import Sidebar from './Sidebar'; // Import your Sidebar component
import Router from "../../router";

import HomeIcon from '@mui/icons-material/Home';
import QueryStatsOutlinedIcon from '@mui/icons-material/QueryStatsOutlined';
import GTranslateOutlinedIcon from '@mui/icons-material/GTranslateOutlined';
import QuestionAnswerOutlinedIcon from '@mui/icons-material/QuestionAnswerOutlined';

const drawerWidth = 240;

const Main = styled('main', { shouldForwardProp: (prop) => prop !== 'open' })<{
    open?: boolean;
}>(({ theme, open }) => ({
    flexGrow: 1,
    padding: theme.spacing(3),
    transition: theme.transitions.create('margin', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
    }),
    marginLeft: `-${drawerWidth}px`,
    ...(open && {
        transition: theme.transitions.create('margin', {
            easing: theme.transitions.easing.easeOut,
            duration: theme.transitions.duration.enteringScreen,
        }),
        marginLeft: 0,
    }),
}));

interface AppBarProps extends MuiAppBarProps {
    open?: boolean;
}

const Sidemenu = styled(MuiAppBar, {
    shouldForwardProp: (prop) => prop !== 'open',
})<AppBarProps>(({ theme, open }) => ({
    transition: theme.transitions.create(['margin', 'width'], {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
    }),
    ...(open && {
        width: `calc(100% - ${drawerWidth}px)`,
        marginLeft: `${drawerWidth}px`,
        transition: theme.transitions.create(['margin', 'width'], {
            easing: theme.transitions.easing.easeOut,
            duration: theme.transitions.duration.enteringScreen,
        }),
    }),
}));

const DrawerHeader = styled('div')(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    padding: theme.spacing(0, 1),
    ...theme.mixins.toolbar,
    justifyContent: 'flex-end',
}));

const sidebarItems = [
    {
        id: 1,
        title: 'Home',
        to: '/home',
        icon: <HomeIcon />,
    },
    {
        id: 2,
        title: 'Browse',
        to: '/browse',
        icon: <QueryStatsOutlinedIcon />,
    },
    {
        id: 3,
        title: 'IPA-Translator',
        to: '/ipa',
        icon: <GTranslateOutlinedIcon />,
    },
    {
        id: 4,
        title: 'Instructions',
        to: '/instructions',
        icon: <QuestionAnswerOutlinedIcon />,
    },
];

export default function SideMenu() {
    const theme = useTheme();
    const [open] = useState(true);
    const colorMode = useContext(ColorModeContext);

    return (
        <Box sx={{ display: 'flex' }}>
            <CssBaseline />
            <Sidemenu position="fixed" open={true} sx={{ backgroundColor: '#355f64' }}>
                <Toolbar style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Box display={'flex'} justifyContent={'center'} alignItems={'center'}>
                        <IconButton
                            color="inherit"
                            aria-label="open drawer"
                            edge="start"
                            sx={{ mr: 2, ...(open && { display: 'none' }) }}
                        >
                            <MenuIcon />
                        </IconButton>
                        <Typography variant="h4" noWrap component="div">
                            Bangla Dictionary
                        </Typography>
                        <MenuBookIcon sx={{ marginLeft: '5px' }} />
                    </Box>
                    <IconButton onClick={colorMode.toggleColorMode}>
                        {theme.palette.mode === 'dark' ? <DarkModeOutlinedIcon /> : <LightModeOutlinedIcon />}
                    </IconButton>
                </Toolbar>
            </Sidemenu>
            <Drawer
                sx={{
                    width: drawerWidth,
                    flexShrink: 0,
                    '& .MuiDrawer-paper': {
                        width: drawerWidth,
                        boxSizing: 'border-box',
                    },
                }}
                variant="persistent"
                anchor="left"
                open={open}
            >
                <DrawerHeader></DrawerHeader>
                <Sidebar sidebarItems={sidebarItems} />
            </Drawer>
            <Main open={open}>
                <DrawerHeader />
                { <Router/> }
            </Main>
        </Box>
    );
}