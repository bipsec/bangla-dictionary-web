import React, { ChangeEvent } from 'react';
import { Box, TextField } from "@mui/material";
import Header from "../../components/Header";
import Button from '@mui/material/Button';

const inputStyles = {
    height: '22em',
};

const containerStyles = {
    marginTop: '16px', // Adjust the marginTop to control the spacing
};

const fileInputStyles = {
    display: 'none', // Hide the file input
};

const fileInputLabelStyles = {
    backgroundColor: '#2196F3',
    color: 'white',
    padding: '10px 20px',
    borderRadius: '4px',
    cursor: 'pointer',
};

const IPA = () => {

    const [inputValue, setInputValue] = React.useState('');

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
        console.log(`Clicked IPA with input value: ${inputValue}`);
    };

    return (
        <Box m="20px">
            <Header title="Generate IPA"></Header>
            <Box>
                <div>
                    <TextField
                        label="Input Text"
                        variant="outlined"
                        fullWidth
                        value={inputValue}
                        onChange={handleInputChange}
                        InputProps={{
                            style: inputStyles,
                        }}
                        multiline
                        rows={10}
                    />
                    <div style={containerStyles}>
                        {/* Hidden file input */}
                        <input
                            type="file"
                            accept=".txt"
                            onChange={handleFileUpload}
                            style={fileInputStyles}
                            id="fileInput" // Connect the label and input using 'for' attribute
                        />
                        {/* Label for file input */}
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
                        >
                            IPA
                        </Button>
                    </div>
                </div>
            </Box>
        </Box>
    )
}

export default IPA;
