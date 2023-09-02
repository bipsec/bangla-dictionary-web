import React, { ChangeEvent, useState } from 'react';
import { Box, TextField, Typography } from "@mui/material";
import Button from '@mui/material/Button';

import AvroTyping from './avro_ipa';

const inputStyles = {
    height: '22em',
};

const containerStyles = {
    marginTop: '16px',
}

const fileInputStyles = {
    display: 'none',
};

const fileInputLabelStyles = {
    backgroundColor: '#446655',
    color: 'white',
    padding: '10px 20px',
    borderRadius: '4px',
    cursor: 'pointer',
};

const customButtonStyles = {
    backgroundColor: '#3d5441',
    color: 'white',
    padding: '8px 16px',
    width: '105px',
};

const IPA = () => {
    const [inputValue, setInputValue] = useState('');

    const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
        setInputValue(event.target.value);
    };

    const handleFileUpload = (event: ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                setInputValue(e.target?.result as string);
            };
            reader.readAsText(file);
        }
    };

    const handleIPAClick = () => {
        // Create IPA Translator logic
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
            <Box>
                <div>
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
                    <div style={containerStyles}>
                        <input
                            type="file"
                            accept=".txt"
                            onChange={handleFileUpload}
                            style={fileInputStyles}
                            id="fileInput"
                        />
                        <label htmlFor="fileInput" style={fileInputLabelStyles}>
                            Upload File
                        </label>
                    </div>
                    <div style={containerStyles}>
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={handleIPAClick}
                            fullWidth
                            style={customButtonStyles}
                        >
                            IPA
                        </Button>
                    </div>
                </div>
            </Box>
            <AvroTyping />
        </Box>
    )
}

export default IPA;
