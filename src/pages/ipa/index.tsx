import { Box, Typography, useTheme} from "@mui/material";
import Header from "../../components/Header";
import {tokens} from "../../theme/theme";


const IPA = () => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);

    return (
        <Box m="20px">
            <Header title = "IPA Page"></Header>
            <Box>

            </Box>
        </Box>
    )
}

export default IPA;
