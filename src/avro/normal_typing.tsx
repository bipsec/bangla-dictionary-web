import React, { ChangeEvent, useState, CSSProperties } from 'react';
import { TextField, Paper, Box, Button, Typography, Grid } from "@mui/material";

import {handleIPA} from "../utils";

const containerStyles: CSSProperties = {
    padding: '20px',
};

const inputStyles: CSSProperties = {
    height: '22em',
    borderColor: '#ccc',
};

const responseStyles: CSSProperties = {
    height: '22em',
    borderColor: '#ccc',
    backgroundColor: 'white',
    color: 'black',
    padding: '16px',
    overflowY: 'auto',
    userSelect: 'none',
};

const buttonStyles = {
    backgroundColor: '#3d5441',
    color: 'white',
    padding: '8px 16px',
    width: '100px',
};

const clearButtonStyles = {
    backgroundColor: '#f44336',
    color: 'white',
    padding: '8px 16px',
    width: '100px',
};

const buttonContainerStyles = {
    display: 'flex',
    justifyContent: 'center',
    marginTop: '20px',
    gap: '15px',
};


const NormalTyping = () => {
    const [inputValue, setInputValue] = useState('');
    const [responses, setResponses] = useState<string[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    console.log(loading,error);

    const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
        setInputValue(event.target.value);
    };

    const handleIPAClick = async () => {
        setLoading(true);
        const { result, error } = await handleIPA(inputValue);
        setResponses(result ? [result] : []);
        setError(error);
        setLoading(false);
    };

    const handleEnterKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === 'Enter') {
            // IPA Translator logic
            handleIPAClick();
        }
    };

    const handleClearClick = () => {
        // Clear the input and responses
        setInputValue('');
        setResponses([]);
        setError(null); // Clear any previous errors
    };

    return (
        <Box m="20px">
            <Typography variant="h2" style={{ paddingBottom: '15px', textAlign: 'center' }}> Generate IPA </Typography>

            <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                    <Paper elevation={3} style={containerStyles}>
                        <TextField
                            label="Input Text"
                            variant="outlined"
                            fullWidth
                            value={inputValue}
                            onChange={handleInputChange}
                            onKeyDown={handleEnterKeyPress}
                            InputProps={{
                                style: inputStyles,
                            }}
                            multiline
                            rows={10}
                        />
                    </Paper>
                </Grid>
                <Grid item xs={12} sm={6}>
                    <Paper elevation={3} style={containerStyles}>
                        <TextField
                            label="Responses"
                            variant="outlined"
                            fullWidth
                            value={responses.join('\n')}
                            InputProps={{
                                style: responseStyles,
                            }}
                            multiline
                            rows={10}
                        />
                    </Paper>
                </Grid>
            </Grid>
            <div style={buttonContainerStyles}>
                <Button
                    variant="contained"
                    color="primary"
                    onClick={handleIPAClick}
                    style={buttonStyles}
                >
                    IPA
                </Button>
                <Button
                    variant="contained"
                    color="secondary"
                    onClick={handleClearClick}
                    style={clearButtonStyles}
                >
                    Clear
                </Button>
            </div>
            {/*{error && (*/}
            {/*    <Typography variant="body1" style={{ color: 'red', marginTop: '10px', textAlign: 'center' }}>*/}
            {/*        {error}*/}
            {/*    </Typography>*/}
            {/*)}*/}
        </Box>
    );
};

export default NormalTyping;
