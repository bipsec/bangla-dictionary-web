import {CssBaseline, ThemeProvider} from "@mui/material";
import LeftSideBar from "./scenes/global/LeftSideBar";
import TopBar from "./scenes/global/TopBar";
import {Route, Routes} from "react-router-dom";
import Home from "./scenes/home";
import About from "./scenes/about";
import IPA from "./scenes/ipa";
import Dictionary from "./scenes/dictionary";
import {ColorModeContext, useMode} from "./theme/theme";

const App = ()=> {
    const [theme, colorMode] = useMode();
    return (
        <ColorModeContext.Provider value={colorMode}>
            <ThemeProvider theme={theme}>
                <CssBaseline/>
                <div className="app">
                    <LeftSideBar/>
                    <main className="content">
                        <TopBar/>
                        <Routes>
                            <Route path="/" element={<Home/>}></Route>
                            <Route path="/about" element={<About/>}></Route>
                            <Route path="/ipa" element={<IPA/>}></Route>
                            <Route path="/dictionary" element={<Dictionary/>}></Route>
                        </Routes>
                    </main>
                </div>
            </ThemeProvider>
        </ColorModeContext.Provider>
    );
}

export default App;
