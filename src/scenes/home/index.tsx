import * as React from "react";
import {useTheme,} from "@mui/material";
import {tokens} from "../../theme/theme";


const Home = () => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);


    return (
        <h2>Welcome to Bangla Dictionary</h2>
    );
};

export default Home;
