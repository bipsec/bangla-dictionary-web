import React, { ChangeEvent, useState } from 'react';
import { TextField, Typography } from "@mui/material";
import Button from '@mui/material/Button';
import AvroPhonetic from "../../avro/avrophonetic";

const inputStyles = {
    height: '22em',
};

const containerStyles = {
    marginTop: '16px',
};

const customButtonStyles = {
    backgroundColor: '#3d5441',
    color: 'white',
    padding: '8px 16px',
    width: '150px',
};

interface AvroTypingProps {
    input: string;
}

const AvroTyping = () => {
    const [inputValue, setInputValue] = useState('');

    const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
        setInputValue(event.target.value);
    };

    const handleAvroTypeClick = () => {
        convertText();
    };

    const handleInputKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === 'Enter') {
            convertText();
        }
    };

    const convertText = () => {
        // Create an AvroTypingProps object
        const avroTypingProps: AvroTypingProps = {
            input: inputValue,
        };

        // Convert the input text using AvroPhonetic
        const avroPhoneticText = AvroPhonetic(avroTypingProps);

        // Update the input value with the converted text
        setInputValue(avroPhoneticText);
    };

    return (
        <div>
            <Typography variant="h2" style={{ paddingBottom: '15px', textAlign: 'center' }}>Type here using Avro</Typography>
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
            <div style={containerStyles}>
                <Button
                    variant="contained"
                    color="primary"
                    onClick={handleAvroTypeClick}
                    fullWidth
                    style={customButtonStyles}
                >
                    Convert
                </Button>
            </div>
        </div>
    );
};

export default AvroTyping;
