import * as React from "react";
import {Route, Routes} from "react-router-dom";
import Home from "../pages/home";
import IPA from "../pages/ipa";
import Dictionary from "../pages/browse";
import WordDetails from "../pages/browse/list-of-words/ListOfWords";

const Router = () => {

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
