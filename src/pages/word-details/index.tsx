import * as React from "react";
import {useEffect, useState} from "react";
import {Box, Paper, Typography} from "@mui/material";
import {useSearchParams} from "react-router-dom";
import axios from "axios";


const WordDetailsPage = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const word = searchParams.get("word");
    const [wordDetails, setWordDetails] = useState<any>({});
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (word) {
            axios.get(`http://localhost:8000/dictionary/word?word=${word}`)
                .then((response) => {
                    setWordDetails(response.data);
                    setLoading(false)
                })
                .catch((error) => {
                    console.error("Error fetching data:", error);
                    setLoading(false);
                });
        }
    }, [word]);

    if (loading) {
        return <Typography>Loading...</Typography>;
    }
    return (
        <Box display={'flex'} flexDirection={'column'} justifyContent={'center'} alignItems={'center'}>
            <Typography variant="h2" style={{textAlign: 'center'}}> Word details</Typography>
            {wordDetails && <Paper sx={{p: 2, width: '600px', m: 2, boxShadow: 'none'}}>

                <h4>{wordDetails?.word}:</h4>
                {wordDetails.hasOwnProperty('similar_spellings') &&
                    wordDetails?.similar_spellings.map((spelling: any) => {
                        console.log("spelling", spelling)
                        return (<Box key={spelling.id} sx={{mb: 1}}>
                            <Typography variant="subtitle1">
                                {spelling.meaning_no}: {spelling?.meaning}
                            </Typography>
                        </Box>)
                    })}
            </Paper>}
        </Box>


    );
};

export default WordDetailsPage;
