import React, { ChangeEvent, useState , CSSProperties} from 'react';
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
    display: 'flex',
    backgroundColor: '#3d5441',
    color: 'white',
    padding: '8px 16px',
    width: 'auto', // Remove fixed width
    margin: '20px auto 0', // Center the button horizontally and add some top margin
};



const IPA = () => {
    const [inputValue, setInputValue] = useState('');
    const [responses, setResponses] = useState<string[]>([]);

    const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
        setInputValue(event.target.value);
    };

    const handleIPAClick = () => {
        // Create IPA Translator logic and update responses
        // For now, I'll add a placeholder response.
        setResponses(["Hello! Please implement some logic to get the expected response."]);
    };

    const handleEnterKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === 'Enter') {
            // Trigger IPA Translator logic when Enter is pressed
            handleIPAClick();
        }
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
                                style: {...responseStyles, textRendering: 'auto'},

                            }}
                            multiline
                            rows={10}
                            // disabled // To prevent user input in the response box
                        />
                    </Paper>
                </Grid>
            </Grid>
            <Button
                variant="contained"
                color="primary"
                onClick={handleIPAClick}
                style={buttonStyles}
            >
                IPA
            </Button>
            <AvroTyping/>
        </Box>


    );
};

export default IPA;
