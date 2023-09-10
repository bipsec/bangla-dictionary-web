import React, { useState } from 'react';
import { Box, Button } from "@mui/material";
import AvroTyping from "../../avro/avro_typing";
import NormalTyping from "../../avro/normal_typing";
import UploadFileComponent from "./UploadFile";

const buttonStyles = {
    backgroundColor: '#3d5441',
    color: 'white',
    padding: '8px 16px',
    width: '135px',
};

const buttonContainerStyles = {
    display: 'flex',
    justifyContent: 'center',
    marginTop: '20px',
    gap: '15px',
};

const IPA = () => {
    const [isNormalTyping, setIsNormalTyping] = useState(false);
    const [isAvroTyping, setIsAvroTyping] = useState(false);
    const [isUploadFile, setIsUploadFile] = useState(false);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);

    const clearContentAndResponses = () => {
        // Removed unused variables: inputValue and responses
        setSelectedFile(null);
    };

    const handleNormalTypingClick = () => {
        setIsNormalTyping(true);
        setIsAvroTyping(false);
        setIsUploadFile(false);
        clearContentAndResponses();
    };

    const handleAvroTypingClick = () => {
        setIsNormalTyping(false);
        setIsAvroTyping(true);
        setIsUploadFile(false);
        clearContentAndResponses();
    };

    const handleFileUploadingClick = () => {
        setIsNormalTyping(false);
        setIsAvroTyping(false);
        setIsUploadFile(true);
        clearContentAndResponses(); // Clear content and responses when switching to file upload
    };

    const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const files = event.target.files;
        if (files && files.length > 0) {
            const file = files[0];
            setSelectedFile(file);
        }
    };

    return (
        <Box m="20px">
            <div style={buttonContainerStyles}>
                <Button
                    variant="contained"
                    color="primary"
                    onClick={handleNormalTypingClick}
                    style={buttonStyles}
                >
                    Normal Typing
                </Button>
                <Button
                    variant="contained"
                    color="primary"
                    onClick={handleAvroTypingClick}
                    style={buttonStyles}
                >
                    Avro Typing
                </Button>
                <input
                    type="file"
                    accept=".txt"
                    onChange={handleFileUpload}
                    style={{ display: 'none' }}
                    id="fileInput"
                />
                <label htmlFor="fileInput">
                    <Button
                        variant="contained"
                        color="primary"
                        component="span"
                        style={buttonStyles}
                        onClick={handleFileUploadingClick}
                    >
                        Upload File
                    </Button>
                </label>
            </div>
            {isNormalTyping && <NormalTyping />}
            {isAvroTyping && <AvroTyping />}
            {isUploadFile && (
                <UploadFileComponent
                    selectedFile={selectedFile}
                    onClear={clearContentAndResponses}
                />
            )}
        </Box>
    );
};

export default IPA;
