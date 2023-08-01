import * as React from "react";
import {useState} from "react";
import {useTheme, Typography} from "@mui/material";
import {tokens} from "../../theme/theme";


const Home = () => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const [inputValue, setInputValue] = useState('');


    const handleInputChange = (e:any) => {
        const inputValue = e.target.value;

        // Convert the input text using Avro JS

    };

    return (
        <Typography variant="h2" style={{textAlign:'center'}}> Welcome to Bangla Dictionary</Typography>

    );
};

export default Home;
