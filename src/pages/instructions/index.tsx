import React, { useState } from 'react';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

const data = {
    1: {
        title: "How to use this dictionary?",
        content: "User can look for meaning for word in browse section. Also can search word based on letters"
    },
    2: {
        title: "How to generate IPA?",
        content: "Input any bangla word and click on IPA button to generate ipa of the word. " +
            "Also user can upload any bangla document to translate the ipa of the document"
    },
    3: {
        title: "What is the difference between other dictionary?",
        content: "Still thinking the answer....."
    },
    4: {
        title: "What is the price of this dictionary?",
        content: "Priceless!!!"
    },
};


const Instructions = () => {
    const [expanded, setExpanded] = useState<Record<string, boolean>>({});

    const toggleExpansion = (id: string) => {
        setExpanded((prevState) => ({
            ...prevState,
            [id]: !prevState[id],
        }));
    };

    return (
        <div style={{ padding: '16px' }}>
            {Object.entries(data).map(([id, { title, content }]) => (
                <div key={id} style={{ marginBottom: '16px' }}>
                    <Paper
                        elevation={3}
                        style={{
                            padding: '16px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            marginBottom: '5px',
                            cursor: 'pointer',
                            backgroundColor: expanded[id] ? '#f0f0f0' : 'white',
                            transition: 'background-color 0.3s',
                        }}
                        onClick={() => toggleExpansion(id)}
                    >
                        <Typography variant="body1">{title}</Typography>
                        <IconButton size="small" onClick={() => toggleExpansion(id)}>
                            <ExpandMoreIcon />
                        </IconButton>
                    </Paper>
                    {expanded[id] && (
                        <Paper elevation={3} style={{ padding: '16px', backgroundColor: '#f0f0f0' }}>
                            <Typography variant="h6">{content}</Typography>
                        </Paper>
                    )}
                </div>
            ))}
        </div>
    );
};

export default Instructions;
