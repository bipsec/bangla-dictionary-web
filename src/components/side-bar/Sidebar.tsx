import React from 'react';
import List from '@mui/material/List';
import Divider from '@mui/material/Divider';
import SidebarItem from './SidebarItem';

import ChatBubbleOutlineOutlinedIcon from '@mui/icons-material/ChatBubbleOutlineOutlined';
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined';
interface SidebarProps {
    sidebarItems: {
        id: number;
        title: string;
        to: string;
        icon: React.ReactNode;
    }[];
}


const Sidebar = ({ sidebarItems }: SidebarProps) => {

    return (
        <div>
            <Divider />
            <List>
                {sidebarItems.map((item) => (
                    <SidebarItem key={item.id} item={item} />
                ))}
            </List>
            <Divider />
            <List>
                {['Chat', 'Help'].map((text, index) => (
                    <SidebarItem
                        key={text}
                        item={{
                            id: index,
                            title: text,
                            to: `/${text.toLowerCase()}`,
                            icon: index % 2 === 0 ? <ChatBubbleOutlineOutlinedIcon /> : <EmailOutlinedIcon />,
                        }}
                    />
                ))}
            </List>
        </div>
    );
}

export default Sidebar;