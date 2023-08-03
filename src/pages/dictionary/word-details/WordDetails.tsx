import { useState, useEffect } from "react";
import {Box, Typography, useTheme, Grid, Paper } from "@mui/material";
import Header from "../../../components/Header";
import {useSearchParams} from "react-router-dom";
import axios from 'axios';


// Define the interface for the response data
interface ApiResponse {
    similar_spellings: {
        id: number;
        meaning_no: string;
        meanings: string[];
    }[];
    word: string;
}

const WordDetailPage = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const letter = searchParams.get("letter")
    const [response, setResponse] = useState<ApiResponse[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (letter) {
            axios.get(`http://localhost:8002/dictionary/words_by_letter/?letter=${letter}`)
                .then((response) => {
                    setResponse(response.data);
                    setLoading(false);
                })
                .catch((error) => {
                    console.error("Error fetching data:", error);
                    setLoading(false);
                });
        }
    }, [letter]);

    if (loading) {
        return <Typography>Loading...</Typography>;
    }

    return (
        <Box m="20px">
            <Header title="List of words Page" />
            <Box mt={3}>
                {response.length === 0 ? (
                    <Typography>No words found for the letter '{letter}'</Typography>
                ) : (
                    <Grid container spacing={3}>
                        {response.map((item) => (
                            <Grid item xs={12} sm={6} md={4} key={item.word}>
                                <Paper variant="outlined" sx={{ p: 2 }}>
                                    <Typography variant="h5" gutterBottom>
                                        {item.word}
                                    </Typography>
                                    <Box mt={2}>
                                        {item.similar_spellings.map((spelling) => (
                                            <Box key={spelling.id} sx={{ mb: 1 }}>
                                                <Typography variant="subtitle1">
                                                    Meaning {spelling.meaning_no}: {spelling.meanings.join(", ")}
                                                </Typography>
                                            </Box>
                                        ))}
                                    </Box>
                                </Paper>
                            </Grid>
                        ))}
                    </Grid>
                )}
            </Box>
        </Box>
    );
};

export default WordDetailPage;
