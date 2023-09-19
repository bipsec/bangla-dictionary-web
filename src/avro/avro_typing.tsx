import React, { ChangeEvent, CSSProperties, useState } from 'react';
import { Box, TextField, Typography, Grid, Button, Paper } from "@mui/material";
import AvroPhonetic from "./avrophonetic";
import {handleIPA} from "../utils";

const containerStyles = {
    padding: '20px',
};

const inputStyles = {
    height: '22em',
    borderColor: '#ccc',
};

const conversionStyles: CSSProperties = {
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

const responseStyles: CSSProperties = {
    marginTop: '20px',
    padding: '16px',
    backgroundColor: 'white',
    borderColor: '#ccc',
    color: 'black',
};

const buttonContainerStyles = {
    display: 'flex',
    justifyContent: 'center',
    marginTop: '20px',
    gap: '15px',
};


const AvroTyping = () => {
    const [inputValue, setInputValue] = useState('');
    const [conversion, setConversion] = useState('');
    const [responses, setResponses] = useState<string[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    console.log(loading, error);

    const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
        const inputText = event.target.value;
        setInputValue(inputText);
        convertText(inputText);
    };

    const handleIPAClick = async () => {
        setLoading(true);
        const { result, error } = await handleIPA(inputValue);
        setResponses(result ? [result] : []);
        setError(error);
        setLoading(false);
    };

    const handleInputKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === 'Enter') {
            handleIPAClick();
        }
    };

    const convertText = (textToConvert: string) => {
        const avroTypingProps = {
            input: textToConvert,
        };

        const avroPhoneticText = AvroPhonetic(avroTypingProps);

        setConversion(avroPhoneticText);
        setResponses([...responses]);
    };

    const handleClearClick = () => {
        setInputValue('');
        setConversion('');
        setResponses([]);
    };

    return (
        <Box m="20px">
            <Typography variant="h2" style={{ paddingBottom: '15px', textAlign: 'center' }}>Type here using Avro</Typography>
            <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                    <Paper elevation={3} style={containerStyles}>
                        <TextField
                            label="Avro Text"
                            variant="outlined"
                            fullWidth
                            value={inputValue}
                            onChange={handleInputChange}
                            onKeyDown={handleInputKeyPress}
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
                            label="Conversion"
                            variant="outlined"
                            fullWidth
                            value={conversion}
                            InputProps={{
                                style: { ...conversionStyles, textRendering: 'auto' },
                            }}
                            multiline
                            rows={10}
                        />
                    </Paper>
                </Grid>
                <Grid item xs={12}>
                    {responses.length > 0 && (
                        <Paper elevation={3} style={responseStyles}>
                            {responses[responses.length - 1]}
                        </Paper>
                    )}
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
        </Box>
    );
};

export default AvroTyping;
