import React, { CSSProperties, useState } from 'react';
import { Box, Button, Paper, TextField } from "@mui/material";

interface UploadFileComponentProps {
    selectedFile: File | null;
    onClear: () => void;
}

const paperStyles = {
    padding: '16px',
    marginTop: '20px',
};

const inputStyles: CSSProperties = {
    height: '15em',
    borderColor: '#ccc',
};

const responseStyles: CSSProperties = {
    height: '17em',
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

const UploadFileComponent: React.FC<UploadFileComponentProps> = ({ selectedFile, onClear }) => {
    const [response, setResponse] = useState<string | null>(null);
    const [isIpaResponse, setIsIpaResponse] = useState<string[]>([]);

    const handleFileLoader = () => {
        if (selectedFile) {

            const reader = new FileReader();

            reader.onload = (event) => {
                if (event.target) {

                    const fileContent = event.target.result as string;

                    setResponse(fileContent);
                }
            };

            reader.readAsText(selectedFile);
        }
    };

    const handleIPAClick = () => {
        // IPA Translator logic
        // A random response
        setIsIpaResponse(["Hello! Please implement some logic to get the expected response."]);
    };

    const handleClearClick = () => {
        setResponse(null);
        setIsIpaResponse([]);
        onClear();
    };

    return (
        <Box>
            <Paper elevation={3} style={paperStyles}>
                <TextField
                    label="Upload File Here"
                    variant="outlined"
                    fullWidth
                    InputProps={{
                        style: inputStyles,
                        value: selectedFile ? (response || "Click to load content") : "No file selected",
                        readOnly: true,
                    }}
                    multiline
                    rows={10}
                />
            </Paper>
            <Paper elevation={3} style={paperStyles}>
                <TextField
                    label="Response"
                    variant="outlined"
                    fullWidth
                    InputProps={{
                        style: responseStyles,
                        value: isIpaResponse.join('\n'),
                        readOnly: true,
                    }}
                    multiline
                    rows={10}
                />
            </Paper>
            <div style={buttonContainerStyles}>
                <Button
                    variant="contained"
                    color="primary"
                    onClick={handleFileLoader}
                    style={{...buttonStyles, width: '150px',}}
                >
                    Load Contents
                </Button>
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

export default UploadFileComponent;
