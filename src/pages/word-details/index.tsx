import React, { useEffect, useState } from "react";
import { Box, Paper, Typography, CircularProgress } from "@mui/material";
import { useSearchParams } from "react-router-dom";
import axios from "axios";

const API_URL = "http://0.0.0.0:8000/dictionary/word";

const WordDetailsPage = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const word = searchParams.get("word");
    const [wordDetails, setWordDetails] = useState<any>({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (word) {
            axios
                .get(`${API_URL}?word=${word}`)
                .then((response) => {
                    setWordDetails(response.data);
                    setLoading(false);
                })
                .catch((error) => {
                    console.error("Error fetching data:", error);
                    setLoading(false);
                    setError("An error occurred while fetching data.");
                });
        }
    }, [word]);

    return (
        <Box
            display="flex"
            flexDirection="column"
            justifyContent="center"
            alignItems="center"

        >
            <Box width="100%" maxWidth="600px">
                <Typography variant="h4" align="center" gutterBottom>
                    Word Details
                </Typography>
                {loading ? (
                    <Box display="flex" justifyContent="center" alignItems="center" minHeight="50vh">
                        <CircularProgress />
                    </Box>
                ) : error ? (
                    <Typography color="error">{error}</Typography>
                ) : wordDetails?.word ? (
                    <Paper elevation={3} sx={{ padding: 2 }}>
                        <Typography variant="h5" gutterBottom>
                            {wordDetails?.word}
                        </Typography>
                        {wordDetails.hasOwnProperty("similar_spellings") &&
                            wordDetails?.similar_spellings.map((spelling: any, index: number) => (
                                <Box key={spelling.id}>
                                    <Typography variant="subtitle1">
                                        {spelling.meaning_no}: {spelling?.meaning}
                                    </Typography>
                                    {index < wordDetails.similar_spellings.length - 1 && (
                                        <Box sx={{ my: 1, borderBottom: "1px solid #ccc" }} />
                                    )}
                                </Box>
                            ))}
                    </Paper>
                ) : (
                    <Paper elevation={3} sx={{ padding: 2 }}>
                        <Typography variant="body1">
                            Word not found. Please check the word and try again.
                        </Typography>
                    </Paper>
                )}
            </Box>
        </Box>
    );
};

export default WordDetailsPage;
