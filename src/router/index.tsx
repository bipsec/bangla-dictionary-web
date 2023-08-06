import * as React from "react";
import {Route, Routes} from "react-router-dom";
import Home from "../pages/home";
import IPA from "../pages/ipa";
import Dictionary from "../pages/browse";
import WordDetailsPage from "../pages/word-details";
import WordList from "../pages/browse/list-of-words/WordList";

const Router = () => {

    return (
        <Routes>
            <Route path="/" element={<Home/>}></Route>
            <Route path="/word" element={<WordDetailsPage/>}></Route>
            <Route path="/home" element={<Home/>}></Route>
            <Route path="/browse" element={<Dictionary/>}/>
            <Route path="/browse/list-of-words" element={<WordList/>}/>
            <Route path="/ipa" element={<IPA/>}></Route>
            <Route path="/browse" element={<Dictionary/>}></Route>
        </Routes>

    );
};

export default Router;
