import React from 'react';
import SearchBox from "../../components/search-box/SearchBox";
import {Box, Grid, Paper, Typography} from "@mui/material";
import {Link} from "react-router-dom";


const About = () => {
    const alphabet = 'অআইঈউঊঋএঐওঔকখগঘঙচছজঝঞটঠডঢণতথদধনপফবভমযরলশষসহড়ঢ়য়ৎংঃঁ';

    const handleHover = (letter: any) => {
        // You can perform any additional actions when a letter is focused here
    };
    return (
        <>
            <Grid container spacing={2}>
                <Grid item xs={12}>
                    <SearchBox/>
                </Grid>
                <Grid item xs={12}>
                    <Grid container spacing={1} justifyContent="center">
                        {alphabet.split('').map((letter) => (
                            <Grid key={letter} item>
                                <Link to={ `/browse/details`} style={{textDecoration: 'none', color: 'black'}}>
                                    <Paper
                                        sx={{
                                            width: 40,
                                            height: 40,
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            cursor: 'pointer',
                                            transition: 'background-color 0.2s ease',
                                            '&:hover': {
                                                backgroundColor: '#f1f1f1',
                                            },
                                        }}
                                        onMouseEnter={() => handleHover(letter)}
                                    >
                                        <Typography variant="body1">{letter}</Typography>
                                    </Paper>
                                </Link>
                            </Grid>
                        ))}
                    </Grid>
                </Grid>

            </Grid>
        </>
    )
}


export default About;
