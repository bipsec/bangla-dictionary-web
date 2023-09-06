import React, { useEffect, useState } from "react";
import { Box, Paper, Typography } from "@mui/material";
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

    if (loading) {
        return <Typography>Loading...</Typography>;
    }

    if (error) {
        return <Typography>{error}</Typography>;
    }

    return (
        <Box
            display="flex"
            flexDirection="column"
            justifyContent="center"
            alignItems="center"
        >
            <Typography variant="h2" align="center">
                Word details
            </Typography>
            {wordDetails && (
                <Paper sx={{ p: 2, width: "600px", m: 2, boxShadow: "none" }}>
                    <Typography variant="h4">{wordDetails?.word}:</Typography>
                    {wordDetails.hasOwnProperty("similar_spellings") &&
                        wordDetails?.similar_spellings.map((spelling: any) => (
                            <Box key={spelling.id} sx={{ mb: 1 }}>
                                <Typography variant="subtitle1">
                                    {spelling.meaning_no}: {spelling?.meaning}
                                </Typography>
                            </Box>
                        ))}
                </Paper>
            )}
        </Box>
    );
};

export default WordDetailsPage;
