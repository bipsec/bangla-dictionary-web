import {Box, Typography, useTheme} from "@mui/material";
import {tokens} from "../../theme"
import Header from "../../components/Header";


const About = () => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);

    return (
        <Box m="20px">
            <Header title="About Page"></Header>
            <Box>

            </Box>
        </Box>
    )
}

export default About;