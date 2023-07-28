import {Box, Typography, useTheme} from "@mui/material";
import Header from "../../../components/Header";
import {useSearchParams} from "react-router-dom";


const WordDetailPage = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const word = searchParams.get("word")
    console.log('word',word)
    return (
        <Box m="20px">
            <Header title="WordDetailPage Page"></Header>
            <Box>
                <Typography>WordDetailPage Page</Typography>
            </Box>
        </Box>
    )
}

export default WordDetailPage;
