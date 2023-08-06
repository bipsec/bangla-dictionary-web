import React, {useEffect, useState} from "react";
import {Accordion, Box, Grid, Pagination, Typography} from "@mui/material";
import Header from "../../../components/Header";
import {useSearchParams} from "react-router-dom";
import axios from 'axios';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import SearchBox from "../../../components/search-box/SearchBox";

const ITEMS_PER_PAGE = 25;
const WordList = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const letter = searchParams.get("letter")
    const [response, setResponse] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);

    const handlePageChange = (e: any, newPage: number) => {
        setCurrentPage(newPage);
    };
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const paginatedData = response.slice(startIndex, startIndex + ITEMS_PER_PAGE);
    const [expandedAccordion, setExpandedAccordion] = useState<any>(null);

    const handleAccordionChange = (index: number) => {
        if (expandedAccordion === index) {
            setExpandedAccordion(null);
        } else {
            setExpandedAccordion(index);
        }
    };
    useEffect(() => {
        if (letter) {
            axios.get(`http://localhost:8000/dictionary/words_by_letter/?letter=${letter}`)
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
        <Grid container spacing={3}>
            <Grid item xs={12}>
                <SearchBox/>
            </Grid>
            <Grid item xs={12}> <Header title={`${letter} - List of words`}/></Grid>
            <Grid item xs={12}>
                {response.length === 0 ? (
                    <Typography>No words found for the letter '{letter}'</Typography>
                ) : (
                    <Grid item container spacing={3}>
                        {paginatedData.map((item, index) => (
                            <Grid item xs={12} sm={6} md={3} key={item?.id}>
                                    <Accordion
                                        key={index}
                                        expanded={expandedAccordion === index}
                                        onChange={() => handleAccordionChange(index)}
                                        sx={{boxShadow: 'none'}}
                                    >
                                        <AccordionSummary
                                            expandIcon={<ExpandMoreIcon/>}
                                            sx={{p: 0}}
                                        >
                                            <Typography p={1}>{item?.word}</Typography>
                                        </AccordionSummary>
                                        <AccordionDetails>
                                            {item?.similar_spellings.map((spelling: any) => (
                                                <Box key={spelling.id} sx={{mb: 1}}>
                                                    <Typography variant="subtitle1">
                                                        {spelling.meaning_no}: {spelling?.meaning}
                                                    </Typography>
                                                </Box>
                                            ))}
                                        </AccordionDetails>
                                    </Accordion>

                            </Grid>
                        ))}

                        <Grid item xs={12} display={'flex'} justifyContent={'center'} alignItems={'center'}>
                            <Pagination count={Math.ceil(response.length / ITEMS_PER_PAGE)}
                                        page={currentPage}
                                        onChange={handlePageChange} variant="outlined" color="secondary"/>
                        </Grid>
                    </Grid>
                )}
            </Grid>

        </Grid>
    );
};

export default WordList;
