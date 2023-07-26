import {Box, useTheme} from "@mui/material";
import Header from "../../components/Header";
import {tokens} from "../../theme/theme";


const Dictionary = () => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);

    return (
        <Box m="20px">
            <Header title = "Dictionary Page"></Header>
            <Box>

            </Box>
        </Box>
    )
}

export default Dictionary;
