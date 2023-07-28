import {Box, Typography, useTheme} from "@mui/material";
import Header from "../../../components/Header";
import {useSearchParams} from "react-router-dom";


const WordDetailPage = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const letter = searchParams.get("letter")
    console.log('word',letter)
    return (
        <Box m="20px">
            <Header title="List of words Page"></Header>
            <Box>
                <Typography>List of words Page</Typography>
            </Box>
        </Box>
    )
}

export default WordDetailPage;
