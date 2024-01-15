import React, { useEffect, useState } from "react";
import { Grid, Pagination, Typography } from "@mui/material";
import Header from "../../../components/Header";
import { Link, useSearchParams } from "react-router-dom";
import axios from 'axios';
import SearchBox from "../../../components/search-box/SearchBox";
import LabelOutlinedIcon from '@mui/icons-material/LabelOutlined';
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";

const ITEMS_PER_PAGE = 25;

const WordList = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const letter = searchParams.get("letter");
    const [response, setResponse] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);

    const handlePageChange = (e: any, newPage: number) => {
        setCurrentPage(newPage);
    };

    // Calculate the start and end indices for the current page
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;

    const paginatedData = response.slice(startIndex, endIndex);

// Calculate the total number of pages
    const totalPages = Math.ceil(response.length / ITEMS_PER_PAGE);




    useEffect(() => {
        if (letter) {
            axios.get(`http://localhost:8001/dictionary/words?letter=${letter}&page=1&limit=500`)
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
        return (
            <Grid container justifyContent="center" alignItems="center">
                <Typography variant="h5">Loading...</Typography>
            </Grid>
        );
    }
    console.log("Total number of items:", response.length);

    console.log("Number of pages:", Math.ceil(response.length / ITEMS_PER_PAGE));

    return (
        <Grid container spacing={3}>
            <Grid item xs={12}>
                <SearchBox />
            </Grid>
            <Grid item xs={12}>
                <Header title={`${letter} - List of words`} />
            </Grid>
            <Grid item xs={12}>
                {response.length === 0 ? (
                    <Typography variant="h5" color="textSecondary">
                        No data found
                    </Typography>
                ) : (
                    <Grid container>
                        {paginatedData.map((item, index) => (
                            <Grid item xs={12} md={3} sm={6} key={index}>
                                <List dense={true}>
                                    <Link to={`/word-details?word=${item?.word}`}
                                          style={{ textDecoration: 'none', color: 'black' }}>
                                        <ListItem>
                                            <LabelOutlinedIcon sx={{ marginRight: '10px' }} />
                                            {`${item?.word}`}
                                        </ListItem>
                                    </Link>
                                </List>
                            </Grid>
                        ))}
                    </Grid>
                )}
            </Grid>
            {response.length > ITEMS_PER_PAGE && (
                <Grid item xs={12} display="flex" justifyContent="center">
                    <Pagination
                        count={totalPages}
                        page={currentPage}
                        onChange={handlePageChange}
                        variant="outlined"
                        color="secondary"
                    />


                </Grid>
            )}
        </Grid>
    );
};

export default WordList;
