import {Box, CssBaseline, ThemeProvider} from "@mui/material";
import {Route, Routes} from "react-router-dom";
import Home from "./scenes/home";
import About from "./scenes/about";
import IPA from "./scenes/ipa";
import Dictionary from "./scenes/dictionary";
import {ColorModeContext, useMode} from "./theme/theme";
import AppBarComponent from "./components/app-bar/AppBar";

const App = ()=> {
    const [theme, colorMode] = useMode();
    return (
        <ColorModeContext.Provider value={colorMode}>
            <ThemeProvider theme={theme}>
                <CssBaseline/>
                <div className="app">
                    <main className="content">
                        <AppBarComponent/>


                    </main>
                </div>
            </ThemeProvider>
        </ColorModeContext.Provider>
    );
}

export default App;
