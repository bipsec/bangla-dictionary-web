import React, {useEffect, useState} from "react";
import {
    Box,
    CircularProgress,
    IconButton,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Typography
} from "@mui/material";
import {useSearchParams} from "react-router-dom";
import axios from "axios";
import Divider from "@mui/material/Divider";
import VolumeUpIcon from '@mui/icons-material/VolumeUp';

const API_URL = "http://localhost:8001/dictionary/word";

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
            <Box width="100%" maxWidth="800px">
                <Box display={'flex'} justifyContent={'center'} alignItems={'center'}> <Typography variant="h2"
                                                                                                   align="center">
                    {wordDetails?.word} {wordDetails?.ipa ? `(${wordDetails.ipa})` : ""}
                </Typography><IconButton><VolumeUpIcon sx={{marginLeft: "5px"}}/></IconButton></Box>

                <Divider sx={{marginBottom: '25px'}}/>

                {loading ? (
                    <Box display="flex" justifyContent="center" alignItems="center" minHeight="50vh">
                        <CircularProgress/>
                    </Box>
                ) : error ? (
                    <Typography color="error">{error}</Typography>
                ) : wordDetails?.word ? (
                    <>

                        <TableContainer component={Paper}>
                            <Table sx={{minWidth: 650}} aria-label="simple table">
                                <TableHead sx={{backgroundColor: '#d8d8d8'}}>
                                    <TableRow>
                                        <TableCell>{"অভিন্ন বানান"}</TableCell>
                                        <TableCell align="center">{"অর্থ"}</TableCell>
                                        <TableCell align="center">{"পদ"}</TableCell>
                                        <TableCell align="center">{"উৎস"}</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {wordDetails.hasOwnProperty("similar_spellings") &&
                                        wordDetails?.similar_spellings.map((spelling: any, index: number) => (
                                            <TableRow
                                                key={index}
                                                sx={{'&:last-child td, &:last-child th': {border: 0}}}
                                            >
                                                <TableCell>
                                                    {spelling?.meaning_no}
                                                </TableCell>
                                                <TableCell align="center">{spelling?.meaning}</TableCell>
                                                <TableCell
                                                    align="center">{spelling?.pos ? spelling?.pos : "-"}</TableCell>
                                                <TableCell
                                                    align="center">{spelling?.source ? spelling?.source : "-"}</TableCell>
                                            </TableRow>
                                        ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                        {/*{wordDetails.hasOwnProperty("similar_spellings") &&
                            wordDetails?.similar_spellings.map((spelling: any, index: number) => (
                                <Box key={spelling.id}>
                                    <Typography variant="subtitle1">
                                        {spelling.meaning_no}: {spelling?.meaning}
                                    </Typography>
                                    {index < wordDetails.similar_spellings.length - 1 && (
                                        <Box sx={{my: 1, borderBottom: "1px solid #ccc"}}/>
                                    )}
                                </Box>
                            ))}*/}
                    </>
                ) : (
                    <Paper elevation={3} sx={{padding: 2}}>
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