import About from "../scenes/about";
import Home from "../scenes/home";

const pagesData: any = [
    {
        path: "",
        element: <Home/>,
        title: "home"
    },
    {
        path: "about",
        element: <About/>,
        title: "about"
    }
];

export default pagesData;