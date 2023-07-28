import * as React from "react";
import {useState} from "react";
import {TextField, useTheme,} from "@mui/material";
import {tokens} from "../theme/theme";
import {Route, Routes} from "react-router-dom";
import Home from "../pages/home";
import About from "../pages/about";
import IPA from "../pages/ipa";
import Dictionary from "../pages/dictionary";
import WordDetails from "../pages/dictionary/word-details/WordDetails";

const Router = () => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const [inputValue, setInputValue] = useState('');


    const handleInputChange = (e: any) => {
        const inputValue = e.target.value;

        // Convert the input text using Avro JS

    };

    return (
            <Routes>
                <Route path="/" element={<Home/>}></Route>
                <Route path="/home" element={<Home/>}></Route>
                <Route path="/browse" element={<Dictionary/>}/>
                <Route path="/browse/list-of-words" element={<WordDetails/>} />
                <Route path="/ipa" element={<IPA/>}></Route>
                <Route path="/browse" element={<Dictionary/>}></Route>
            </Routes>

       );
};

export default Router;
