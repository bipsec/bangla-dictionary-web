import {useState} from "react";
import {Menu, MenuItem, ProSidebar} from "react-pro-sidebar";
import {Box, IconButton, Typography, useTheme} from "@mui/material";
import {Link} from "react-router-dom";
import "react-pro-sidebar/dist/css/styles.css";
import {tokens} from "../../theme";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import MenuOutlinedIcon from "@mui/icons-material/MenuOutlined";
import ReviewsOutlinedIcon from '@mui/icons-material/ReviewsOutlined';
import SendOutlinedIcon from '@mui/icons-material/SendOutlined';

import LibraryBooksOutlinedIcon from '@mui/icons-material/LibraryBooksOutlined';
import GraphicEqOutlinedIcon from '@mui/icons-material/GraphicEqOutlined';


const Item = ({ title, to, icon, selected, setSelected }:any) => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    return (
        <MenuItem
            active={selected === title}
            style={{
                color: colors.grey[100],
            }}
            onClick={() => setSelected(title)}
            icon={icon}
        >
            <Typography>{title}</Typography>
            <Link to={to} />
        </MenuItem>
    );
};

const Sidebar = () => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [selected, setSelected] = useState("Dashboard");

    return (
        <Box
            sx={{
                "& .pro-sidebar-inner": {
                    background: `${colors.primary[400]} !important`,
                },
                "& .pro-icon-wrapper": {
                    backgroundColor: "transparent !important",
                },
                "& .pro-inner-item": {
                    padding: "5px 35px 5px 20px !important",
                },
                "& .pro-inner-item:hover": {
                    color: "#868dfb !important",
                },
                "& .pro-menu-item.active": {
                    color: "#6870fa !important",
                },
            }}
        >
            <ProSidebar collapsed={isCollapsed}>
                <Menu iconShape="square">
                    {/* LOGO AND MENU ICON */}
                    <MenuItem
                        onClick={() => setIsCollapsed(!isCollapsed)}
                        icon={isCollapsed ? <MenuOutlinedIcon /> : undefined}
                        style={{
                            margin: "10px 0 20px 0",
                            color: colors.grey[100],
                        }}
                    >
                        {!isCollapsed && (
                            <Box
                                display="flex"
                                justifyContent="space-between"
                                alignItems="center"
                                ml="15px"
                            >
                                <Typography variant="h3" color={colors.grey[100]}>
                                    Dictionary
                                </Typography>
                                <IconButton onClick={() => setIsCollapsed(!isCollapsed)}>
                                    <MenuOutlinedIcon />
                                </IconButton>
                            </Box>
                        )}
                    </MenuItem>

                    {!isCollapsed && (
                        <Box mb="25px">
                            <Box display="flex" justifyContent="center" alignItems="center">
                                <img
                                    alt="dictionary-logo"
                                    width="100px"
                                    height="100px"
                                    src={`../../assets/bd_dict.png`}
                                    style={{ cursor: "pointer", borderRadius: "50%", marginRight: "80px" }}
                                />
                            </Box>
                            {/*<Box textAlign="center">*/}
                            {/*    <Typography*/}
                            {/*        variant="h2"*/}
                            {/*        color={colors.grey[100]}*/}
                            {/*        fontWeight="bold"*/}
                            {/*        sx={{ m: "10px 0 0 0" }}*/}
                            {/*    >*/}
                            {/*        Ed Roh*/}
                            {/*    </Typography>*/}
                            {/*    <Typography variant="h5" color={colors.greenAccent[500]}>*/}
                            {/*        VP Fancy Admin*/}
                            {/*    </Typography>*/}
                            {/*</Box>*/}
                        </Box>
                    )}

                    <Box paddingLeft={isCollapsed ? undefined : "10%"}>
                        <Item
                            title="Home"
                            to="/"
                            icon={<HomeOutlinedIcon />}
                            selected={selected}
                            setSelected={setSelected}
                        />

                        <Typography
                            variant="h6"
                            color={colors.grey[300]}
                            sx={{ m: "15px 0 5px 20px" }}
                        >
                            Contents
                        </Typography>
                        <Item
                            title="Dictionary"
                            to="/dictionary"
                            icon={<LibraryBooksOutlinedIcon/>}
                            selected={selected}
                            setSelected={setSelected}
                        />
                        <Item
                            title="IPA"
                            to="/ipa"
                            icon={<GraphicEqOutlinedIcon />}
                            selected={selected}
                            setSelected={setSelected}
                        />
                        <Item
                            title="About"
                            to="/about"
                            icon={<ReviewsOutlinedIcon />}
                            selected={selected}
                            setSelected={setSelected}
                        />

                        {/*<Typography*/}
                        {/*    variant="h6"*/}
                        {/*    color={colors.grey[300]}*/}
                        {/*    sx={{ m: "15px 0 5px 20px" }}*/}
                        {/*>*/}
                        {/*    Pages*/}
                        {/*</Typography>*/}
                        {/*<Item*/}
                        {/*    title="Leaderboard"*/}
                        {/*    to="/leaderboard"*/}
                        {/*    icon={<LeaderboardOutlinedIcon />}*/}
                        {/*    selected={selected}*/}
                        {/*    setSelected={setSelected}*/}
                        {/*/>*/}
                        {/*<Item*/}
                        {/*    title="Analytics"*/}
                        {/*    to="/analytics"*/}
                        {/*    icon={<AutoGraphOutlinedIcon />}*/}
                        {/*    selected={selected}*/}
                        {/*    setSelected={setSelected}*/}
                        {/*/>*/}
                        {/*<Item*/}
                        {/*    title="Locations"*/}
                        {/*    to="/locations"*/}
                        {/*    icon={<LocationOnOutlinedIcon/>}*/}
                        {/*    selected={selected}*/}
                        {/*    setSelected={setSelected}*/}
                        {/*/>*/}

                        <Typography
                            variant="h6"
                            color={colors.grey[300]}
                            sx={{ m: "15px 0 5px 20px" }}
                        >
                            Contacts
                        </Typography>
                        <Item
                            title=" Chat"
                            to="/chat"
                            icon={< SendOutlinedIcon/>}
                            selected={selected}
                            setSelected={setSelected}
                        />
                        {/*<Item*/}
                        {/*    title="Pie Chart"*/}
                        {/*    to="/pie"*/}
                        {/*    icon={<PieChartOutlineOutlinedIcon />}*/}
                        {/*    selected={selected}*/}
                        {/*    setSelected={setSelected}*/}
                        {/*/>*/}
                        {/*<Item*/}
                        {/*    title="Line Chart"*/}
                        {/*    to="/line"*/}
                        {/*    icon={<TimelineOutlinedIcon />}*/}
                        {/*    selected={selected}*/}
                        {/*    setSelected={setSelected}*/}
                        {/*/>*/}
                        {/*<Item*/}
                        {/*    title="Geography Chart"*/}
                        {/*    to="/geography"*/}
                        {/*    icon={<MapOutlinedIcon />}*/}
                        {/*    selected={selected}*/}
                        {/*    setSelected={setSelected}*/}
                        {/*/>*/}
                    </Box>
                </Menu>
            </ProSidebar>
        </Box>
    );
};

export default Sidebar;