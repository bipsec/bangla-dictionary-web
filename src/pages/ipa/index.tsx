import React, { useState } from 'react';
import { Box, Button } from "@mui/material";
import AvroTyping from "../../avro/avro_typing";
import NormalTyping from "../../avro/normal_typing";

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

    const handleNormalTypingClick = () => {
        setIsNormalTyping(true);
        setIsAvroTyping(false);
    };

    const handleAvroTypingClick = () => {
        setIsNormalTyping(false);
        setIsAvroTyping(true);
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
            </div>
            {isNormalTyping && <NormalTyping />}
            {isAvroTyping && <AvroTyping />}
        </Box>
    );
};

export default IPA;
