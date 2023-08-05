import {Box, CssBaseline, ThemeProvider} from "@mui/material";
import {Route, Routes} from "react-router-dom";
import Home from "./pages/home";
import About from "./pages/about";
import IPA from "./pages/ipa";
import Dictionary from "./pages/browse";
import {ColorModeContext, useMode} from "./theme/theme";
import SideMenu from "./components/side-bar/Sidemenu";

const App = ()=> {
    const [theme, colorMode] = useMode();
    return (
        <ColorModeContext.Provider value={colorMode}>
            <ThemeProvider theme={theme}>
                <CssBaseline/>
                <div className="app">
                    <main className="content">
                        <SideMenu/>

                    </main>
                </div>
            </ThemeProvider>
        </ColorModeContext.Provider>
    );
}

export default App;
