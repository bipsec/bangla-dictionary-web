import * as React from "react";
import {useState} from "react";
import {useTheme,} from "@mui/material";
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
        <> <h1 style={{textAlign:'center'}}>Welcome to Bangla Dictionary</h1></>

    );
};

export default Home;
