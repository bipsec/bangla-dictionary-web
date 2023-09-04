import React, { ChangeEvent, useState, CSSProperties } from 'react';
import { Box, TextField, Typography, Button, Grid, Paper } from "@mui/material";
import AvroTyping from "./avro_ipa";

const containerStyles = {
    padding: '20px',
};

const inputStyles = {
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
    gap: '15px'
};

const IPA = () => {
    const [inputValue, setInputValue] = useState('');
    const [responses, setResponses] = useState<string[]>([]);

    const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
        setInputValue(event.target.value);
    };

    const handleIPAClick = () => {
        // IPA Translator logic
        // A random response
        setResponses(["Hello! Please implement some logic to get the expected response."]);
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
                                style: { ...responseStyles, textRendering: 'auto' },
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
            <AvroTyping/>
        </Box>
    );
};

export default IPA;
