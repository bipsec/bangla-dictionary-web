import React from 'react';
import { Link } from 'react-router-dom';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';

interface SidebarItemProps {
    item: {
        id: number;
        title: string;
        to: string;
        icon: React.ReactNode;
    };
}


const SidebarItem = ({ item }: SidebarItemProps) => {
    return (
        <Link to={item.to} style={{ textDecoration: 'none', color: 'black' }}>
            <ListItem key={item.id} disablePadding>
                <ListItemButton>
                    <ListItemIcon>{item.icon}</ListItemIcon>
                    <ListItemText primary={item.title} />
                </ListItemButton>
            </ListItem>
        </Link>
    );
}

export default SidebarItem;
